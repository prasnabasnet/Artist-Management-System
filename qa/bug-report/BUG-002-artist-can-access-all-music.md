# BUG-002 — Artist Can Access All Music Records

**Severity:** High
**Priority:** P1
**Status:** Open
**Detection Method:** Code Review
**Component:** GraphQL API — Music Management
**Affected Operation:** `allMusic`

## Description

An authenticated Artist user can access the `allMusic` query and retrieve music records belonging to all artists.

The resolver only checks whether the user is authenticated with `@login_required`. It does not verify the user's role or restrict the returned records to the currently authenticated artist.

## Expected Result

Only users authorized to manage or view the complete music catalogue should be able to access all music records.

An Artist should only be able to access their own music through `myMusic`.

## Actual Result

Based on code review, any authenticated user can call `allMusic`, including an Artist user.

The resolver contains:

```python
@login_required
def resolve_all_music(self, info, search=None, first=None, skip=0):
```

but there is no role or ownership check before returning:

```python
queryset = Music.objects.filter(filters).order_by("-created_at")
```

Therefore, an authenticated Artist can potentially retrieve music belonging to other artists.

## Impact

This creates an authorization and data-isolation issue.

An Artist may be able to view information belonging to other artists, including:

* Song titles
* Album names
* Genres
* Artist names
* Creation and update timestamps

The nested `artist` field also exposes information about the associated Artist record.

## Root Cause

The `allMusic` resolver implements authentication but not authorization.

Authentication answers:

> "Is this user logged in?"

Authorization should additionally answer:

> "Is this user's role allowed to access all music records?"

The current implementation only performs the first check.

## Recommended Fix

Add an authorization check before returning the complete music queryset.

For example, restrict `allMusic` to appropriate management roles:

```python
@login_required
def resolve_all_music(self, info, search=None, first=None, skip=0):
    user = info.context.user

    if not (user.is_super_admin or user.is_artist_manager):
        raise Exception("You do not have permission to view all music.")

    filters = Q(is_active=True)

    if search:
        filters &= (
            Q(title__icontains=search)
            | Q(album_name__icontains=search)
            | Q(artist__name__icontains=search)
            | Q(genre__icontains=search)
        )

    queryset = Music.objects.filter(filters).order_by("-created_at")

    total_count = queryset.count()
    paginated = (
        queryset[skip: skip + first]
        if first is not None
        else queryset[skip:]
    )

    return PaginatedMusicType(
        total_rows=total_count,
        rows=list(paginated)
    )
```

## Verification Plan

| Test                                  | Expected Result         |
| ------------------------------------- | ----------------------- |
| Super Admin calls `allMusic`          | Allowed                 |
| Artist Manager calls `allMusic`       | Allowed                 |
| Artist calls `allMusic`               | Rejected                |
| Unauthenticated user calls `allMusic` | Rejected                |
| Artist calls `myMusic`                | Only own music returned |

## Related Test Case

**AUTHZ-014 — Artist cannot access all music records**

## Evidence Status

This defect was identified through source-code review.

**Runtime reproduction:** Not yet executed.

Therefore, this report should be treated as a **code-review finding** until the API behavior is verified with an Artist account.
