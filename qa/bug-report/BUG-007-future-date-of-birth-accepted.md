# BUG-007 — Future Date of Birth Is Accepted

**Severity:** Medium
**Priority:** P2
**Status:** Open
**Detection Method:** Code Review
**Component:** GraphQL API — Artist Management
**Affected Operations:** `createArtist`, `updateArtist`

## Description

The Artist's `dob` field accepts any valid calendar date, including dates in the future.

There is no validation ensuring that an Artist's date of birth is earlier than the current date.

## Expected Result

The API should reject a future date of birth.

For example:

```text
dob = 2035-01-01
```

should return a validation error such as:

```text
Date of birth cannot be in the future.
```

## Actual Result

The GraphQL input defines `dob` as:

```python id="6j8v2p"
dob = graphene.Date(required=True)
```

The mutation then directly assigns the value:

```python id="1m5c7r"
artist.dob = input.dob
```

There is no check comparing the supplied date with the current date.

The Django model also defines:

```python id="4n2q8w"
dob = models.DateField()
```

`DateField` validates the date format but does not, by itself, enforce that the date is not in the future.

## Impact

Invalid Artist information can be stored in the system.

This can affect:

* Artist profile accuracy
* Age-related calculations
* Reports and analytics
* Data quality
* Downstream systems relying on the Artist's age

## Root Cause

The application validates that `dob` is a date but does not validate the business rule that the date must be in the past.

## Recommended Fix

Add business-level validation before saving the Artist.

For example:

```python id="7s4k1m"
from django.utils import timezone

if input.dob > timezone.localdate():
    raise Exception("Date of birth cannot be in the future.")
```

This validation should be applied consistently to both Artist creation and update.

## Verification Plan

| Test                | Input        | Expected Result                    |
| ------------------- | ------------ | ---------------------------------- |
| Valid past date     | `1995-05-10` | Accepted                           |
| Current date        | Today's date | Business-rule dependent            |
| Future date         | `2035-01-01` | Rejected                           |
| Invalid date format | `1995-99-99` | Rejected by date parsing           |
| Missing DOB         | Omitted      | Rejected because field is required |

## Related Test Cases

**ARTIST-001 — Create Artist**

**ARTIST-004 — Update Artist**

**ARTIST-006 — Invalid Artist data**

## Evidence Status

This finding was identified through source-code review.

**Runtime reproduction:** Not yet executed.

The application's intended business rule should be confirmed before marking this as a confirmed runtime defect.
