# BUG-001 — Artist Can Access All Artist Records

## Bug Information

| Field              | Value                                                     |
| ------------------ | --------------------------------------------------------- |
| Bug ID             | BUG-001                                                   |
| Title              | Artist role can access all artist records through GraphQL |
| Severity           | High                                                      |
| Priority           | P1                                                        |
| Status             | Open                                                      |
| Detection Method   | Code Review                                               |
| Component          | GraphQL / Artist Management                               |
| Affected Operation | `allArtist`                                               |

---

## Description

The `allArtist` GraphQL query is protected only by authentication using `@login_required`.

It does not verify whether the authenticated user has a management role.

According to the application's role model:

* `super_admin` can manage artists.
* `artist_manager` can manage artists.
* `artist` should only access their own profile and music through the Artist Portal.

However, the current resolver allows any authenticated user to retrieve the artist listing.

---

## Technical Evidence

Current implementation:

```python
@login_required
def resolve_all_artist(self, info, search=None, first=None, skip=0):
    filters = Q(is_active=True)

    if search:
        filters &= Q(name__icontains=search)

    queryset = Artist.objects.filter(filters).order_by("-created_at")
```

There is no authorization check such as:

```python
if not user.is_super_admin and not user.is_artist_manager:
    raise Exception("You do not have permission.")
```

---

## Preconditions

* A valid user account exists.
* The user has the `artist` role.
* At least one active artist record exists.
* The artist is authenticated.

---

## Steps to Reproduce

1. Authenticate as an `artist` user.
2. Obtain a valid JWT.
3. Send a GraphQL request to `allArtist`.
4. Include the JWT in the authorization header.

Example:

```graphql
query {
  allArtist(first: 10, skip: 0) {
    totalRows
    rows {
      id
      name
      dob
      gender
      address
    }
  }
}
```

---

## Expected Result

The request should be rejected because an `artist` does not have permission to access the management-level artist listing.

Only authorized management roles should access `allArtist`.

---

## Actual Result

Based on code analysis, the request reaches `resolve_all_artist()` for any authenticated user because the resolver checks authentication but does not perform role-based authorization.

The resolver returns active artist records.

---

## Impact

An artist account may be able to access information belonging to other artists.

Depending on the data exposed by the `ArtistType`, this may disclose:

* Artist names
* Date of birth
* Gender
* Address
* Release information
* Other exposed artist fields

This violates the intended role-based access model.

---

## Root Cause

Authentication and authorization are treated as separate concerns, but the resolver currently implements only authentication.

```text
Current:

Authenticated?
     ↓
YES
     ↓
Return all artists
```

Expected:

```text
Authenticated?
     ↓
YES
     ↓
Is Super Admin or Artist Manager?
     ↓
YES → Return artists
NO  → Reject request
```

---

## Recommended Fix

Add a role check to `resolve_all_artist()`.

For example:

```python
@login_required
def resolve_all_artist(self, info, search=None, first=None, skip=0):
    user = info.context.user

    if not user.is_super_admin and not user.is_artist_manager:
        raise Exception("You do not have permission to view artists.")

    filters = Q(is_active=True)

    if search:
        filters &= Q(name__icontains=search)

    queryset = Artist.objects.filter(filters).order_by("-created_at")

    total_count = queryset.count()

    paginated = (
        queryset[skip:skip + first]
        if first is not None
        else queryset[skip:]
    )

    return PaginatedArtistType(
        total_rows=total_count,
        rows=list(paginated),
    )
```

---

## Verification

After fixing:

1. Authenticate as `super_admin`.
2. Execute `allArtist`.
3. Confirm the request succeeds.
4. Authenticate as `artist_manager`.
5. Execute `allArtist`.
6. Confirm the request succeeds.
7. Authenticate as `artist`.
8. Execute `allArtist`.
9. Confirm the request is rejected.

---

## QA Test Case

Related test:

`AUTHZ-013 — Artist Attempts to View All Artists`

Expected outcome after the fix:

```text
super_admin     → PASS / Allowed
artist_manager  → PASS / Allowed
artist           → PASS / Rejected as expected
```

---

## Evidence Status

**Code-level evidence:** Confirmed.

**Runtime reproduction:** Not yet executed.

This defect should therefore be presented as a **code-review finding** until the GraphQL request is executed against the running application.
