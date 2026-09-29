# BUG-003 — Artist Can Access Any Artist Profile

**Severity:** High
**Priority:** P1
**Status:** Open
**Detection Method:** Code Review
**Component:** GraphQL API — Artist Management
**Affected Operation:** `artistById`

## Description

An authenticated Artist user can request any active Artist profile by providing its ID.

The `artistById` resolver verifies that the user is authenticated, but it does not verify the user's role or whether the requested Artist profile belongs to the authenticated user.

## Expected Result

An Artist should only be able to access their own Artist profile.

Super Admins and Artist Managers may access Artist profiles according to their authorized permissions.

## Actual Result

Based on code review, any authenticated user can call `artistById` with an active Artist ID.

The resolver contains:

```python id="3qjv8c"
@login_required
def resolve_artist_by_id(self, info, id):
    try:
        return Artist.objects.get(id=id, is_active=True)
    except Artist.DoesNotExist:
        raise Exception("Artist not found")
```

There is no authorization or ownership check.

## Impact

An Artist could potentially access information belonging to other Artists, including:

* Name
* Date of birth
* Gender
* Address
* First release year
* Number of albums released

This represents an unauthorized data-access issue.

## Root Cause

The resolver performs authentication but does not perform authorization.

The application has a dedicated `myArtistProfile` query that correctly checks whether the user is an Artist:

```python id="q6z9rp"
if not user.is_artist:
    raise Exception("Only artists can access this.")
```

However, `artistById` has no equivalent restriction.

## Recommended Fix

Apply role-based authorization before returning the requested Artist.

For an Artist user, the requested profile should be restricted to their own profile.

For example:

```python id="4c1m8n"
@login_required
def resolve_artist_by_id(self, info, id):
    user = info.context.user

    if user.is_artist:
        try:
            return Artist.objects.get(
                id=id,
                user=user,
                is_active=True
            )
        except Artist.DoesNotExist:
            raise Exception("Artist not found")

    if not (user.is_super_admin or user.is_artist_manager):
        raise Exception("You do not have permission to view this artist.")

    try:
        return Artist.objects.get(id=id, is_active=True)
    except Artist.DoesNotExist:
        raise Exception("Artist not found")
```

## Verification Plan

| Test                                         | Expected Result    |
| -------------------------------------------- | ------------------ |
| Super Admin requests Artist A                | Allowed            |
| Artist Manager requests Artist A             | Allowed            |
| Artist requests their own profile            | Allowed            |
| Artist requests another Artist's profile     | Rejected           |
| Unauthenticated user requests Artist profile | Rejected           |
| Non-existent Artist ID                       | `Artist not found` |

## Related Test Case

**AUTHZ-013 — Artist cannot access other artist profiles**

## Evidence Status

This defect was identified through source-code review.

**Runtime reproduction:** Not yet executed.

The finding should therefore be presented as a **code-review authorization finding**, rather than claiming that the behavior has already been reproduced in the running application.
