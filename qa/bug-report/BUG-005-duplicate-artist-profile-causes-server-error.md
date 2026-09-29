# BUG-005 — Duplicate Artist Profile Assignment Can Cause Server Error

**Severity:** Medium
**Priority:** P2
**Status:** Open
**Detection Method:** Code Review
**Component:** GraphQL API — Artist Management
**Affected Operations:** `createArtist`, `updateArtist`

## Description

The `Artist` model defines a One-to-One relationship between an Artist profile and a User account.

However, the `createArtist` and `updateArtist` mutations do not check whether the selected user already has an Artist profile before assigning that user to another Artist record.

This can result in a database integrity error instead of a controlled GraphQL validation error.

## Expected Result

If a manager attempts to assign a User who already has an Artist profile to another Artist record, the API should reject the request with a clear validation message.

For example:

> This user already has an artist profile.

The application should not return an unhandled server/database error.

## Actual Result

The `Artist` model contains:

```python id="5h2r8k"
user = models.OneToOneField(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='artist_profile'
)
```

This means a User can be associated with at most one Artist record.

However, `CreateArtist` performs:

```python id="7m4c1p"
user = User.objects.get(
    id=input.user_id,
    role='artist'
)

artist.user = user
```

without first checking whether that User already has an Artist profile.

The same issue exists in `UpdateArtist`.

## Impact

A manager could submit a valid-looking request using a User who is already linked to another Artist profile.

Instead of receiving a controlled validation response, the application may encounter a database integrity error.

This can result in:

* An unexpected GraphQL error
* HTTP 500 behavior depending on exception handling
* Poor user experience
* Unclear feedback to the API consumer
* Potential transaction/data-integrity concerns

## Root Cause

The application relies on the database's One-to-One constraint but does not perform application-level validation before assigning the relationship.

There is also no explicit handling for the potential `IntegrityError`.

## Recommended Fix

Check whether the selected User already has an Artist profile before assigning them.

For example:

```python id="9v6k3a"
user = User.objects.get(
    id=input.user_id,
    role=RoleChoices.ARTIST
)

if hasattr(user, "artist_profile"):
    raise Exception("This user already has an artist profile.")

artist.user = user
```

For `UpdateArtist`, the check should also allow the Artist record currently being updated to remain linked to its existing User.

A more robust implementation could perform the operation inside a transaction and handle database integrity errors explicitly.

## Verification Plan

| Test                                                     | Expected Result             |
| -------------------------------------------------------- | --------------------------- |
| Create Artist with an unlinked Artist user               | Artist created              |
| Create Artist with a user already linked to an Artist    | Controlled validation error |
| Update Artist using an unlinked Artist user              | Artist updated              |
| Update Artist using another Artist's already-linked user | Controlled validation error |
| Update an Artist while keeping its current user          | Allowed                     |
| Use a non-Artist user                                    | Validation error            |

## Related Test Cases

**ARTIST-001 — Create Artist**

**ARTIST-004 — Update Artist**

**ARTIST-008 — Invalid Artist/User association**

## Evidence Status

This finding was identified through source-code review.

**Runtime reproduction:** Not yet executed.

The database behavior should be verified in the test environment before marking the defect as runtime-confirmed.
