# BUG-004 — Artist Can Access Any Music Record

**Severity:** High
**Priority:** P1
**Status:** Open
**Detection Method:** Code Review
**Component:** GraphQL API — Music Management
**Affected Operation:** `musicById`

## Description

An authenticated Artist user can request any active music record by providing its ID.

The `musicById` resolver verifies authentication but does not verify whether the requested music belongs to the currently authenticated Artist.

## Expected Result

An Artist should only be able to access music belonging to their own Artist profile.

Super Admins and Artist Managers may access music records according to their authorized permissions.

## Actual Result

Based on code review, any authenticated user can call `musicById` with the ID of an active music record.

The resolver currently contains:

```python id="x7p2k4"
@login_required
def resolve_music_by_id(self, info, id):
    try:
        return Music.objects.get(id=id, is_active=True)
    except Music.DoesNotExist:
        raise Exception("Music not found")
```

There is no role or ownership check.

## Impact

An Artist could potentially access music belonging to another Artist, including:

* Song title
* Album name
* Genre
* Associated Artist information
* Creation and update timestamps

This creates an unauthorized data-access vulnerability.

## Root Cause

The resolver checks authentication but does not perform authorization.

The application already has a separate `myMusic` query that filters music using the authenticated Artist:

```python id="q3v9r1"
queryset = Music.objects.filter(
    artist=artist,
    is_active=True
)
```

However, `musicById` does not apply the same ownership restriction.

## Recommended Fix

For an Artist user, restrict the requested music record to music belonging to their Artist profile.

For example:

```python id="b8n4s2"
@login_required
def resolve_music_by_id(self, info, id):
    user = info.context.user

    if user.is_artist:
        try:
            return Music.objects.get(
                id=id,
                artist__user=user,
                is_active=True
            )
        except Music.DoesNotExist:
            raise Exception("Music not found")

    if not (user.is_super_admin or user.is_artist_manager):
        raise Exception("You do not have permission to view this music.")

    try:
        return Music.objects.get(id=id, is_active=True)
    except Music.DoesNotExist:
        raise Exception("Music not found")
```

## Verification Plan

| Test                                     | Expected Result   |
| ---------------------------------------- | ----------------- |
| Super Admin requests any music record    | Allowed           |
| Artist Manager requests any music record | Allowed           |
| Artist requests their own music          | Allowed           |
| Artist requests another Artist's music   | Rejected          |
| Unauthenticated user requests music      | Rejected          |
| Non-existent music ID                    | `Music not found` |

## Related Test Case

**AUTHZ-014 — Artist cannot access music belonging to another artist**

## Evidence Status

This defect was identified through source-code review.

**Runtime reproduction:** Not yet executed.

The report should therefore be classified as a **code-review authorization finding** until verified against the running application.
