# BUG-006 — Negative Artist Values Are Not Validated

**Severity:** Medium
**Priority:** P2
**Status:** Open
**Detection Method:** Code Review
**Component:** GraphQL API — Artist Management
**Affected Operations:** `createArtist`, `updateArtist`

## Description

The Artist model defines `first_release_year` and `no_of_albums_released` as `PositiveIntegerField`, meaning these values should never be negative.

However, the GraphQL `ArtistInput` accepts generic `Int` values without application-level validation.

A negative value can therefore reach the mutation logic instead of being rejected with a clear validation error.

## Expected Result

The API should reject invalid negative values before attempting to save the Artist.

Examples:

```text
firstReleaseYear = -2020
noOfAlbumsReleased = -5
```

Expected response:

```text
Invalid value: noOfAlbumsReleased must be 0 or greater.
```

## Actual Result

The GraphQL input is defined as:

```python id="r8c2m6"
class ArtistInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    dob = graphene.Date(required=True)
    gender = GenderEnum(required=True)
    address = graphene.String(required=True)
    first_release_year = graphene.Int()
    no_of_albums_released = graphene.Int()
    user_id = graphene.ID()
```

There are no explicit minimum-value checks.

The model defines these fields as:

```python id="k3n7p1"
first_release_year = models.PositiveIntegerField(null=True)
no_of_albums_released = models.PositiveIntegerField(default=0)
```

Therefore, invalid negative input is not rejected at the GraphQL input layer.

## Impact

Invalid input can reach the database layer and may result in:

* Database validation/integrity errors
* Unexpected GraphQL errors
* Possible HTTP 500 behavior depending on exception handling
* Poor error messages for API consumers
* Invalid data being accepted if database constraints are not enforced as expected

## Root Cause

There is a mismatch between the GraphQL input validation and the model's intended data constraints.

The GraphQL layer accepts any integer, while the domain model requires non-negative values.

## Recommended Fix

Add explicit validation before saving the Artist.

For example:

```python id="m6v2q9"
if input.first_release_year is not None and input.first_release_year < 0:
    raise Exception("First release year cannot be negative.")

if input.no_of_albums_released is not None and input.no_of_albums_released < 0:
    raise Exception("Number of albums cannot be negative.")
```

Ideally, the project should use consistent validation at the application/domain layer and rely on the database constraint as a final safety boundary.

## Verification Plan

| Test                    | Input         | Expected Result                  |
| ----------------------- | ------------- | -------------------------------- |
| Valid release year      | `2020`        | Accepted                         |
| Zero albums             | `0`           | Accepted                         |
| Negative release year   | `-2020`       | Rejected                         |
| Negative album count    | `-5`          | Rejected                         |
| Both negative           | `-2020`, `-5` | Rejected                         |
| Missing optional values | Omitted       | Accepted if business rules allow |

## Related Test Cases

**ARTIST-001 — Create Artist**

**ARTIST-004 — Update Artist**

**ARTIST-006 — Invalid Artist data**

## Evidence Status

This finding was identified through source-code review.

**Runtime reproduction:** Not yet executed.

The exact database/runtime response should be verified before classifying this as a confirmed runtime defect.
