# BUG-008 — Empty Artist Text Fields Are Not Validated

**Severity:** Medium
**Priority:** P2
**Status:** Open
**Detection Method:** Code Review
**Component:** GraphQL API — Artist Management
**Affected Operations:** `createArtist`, `updateArtist`

## Description

The GraphQL `ArtistInput` marks several text fields as required, but the application does not validate that the supplied strings actually contain meaningful content.

For example, a client can potentially submit whitespace-only values for `name` or `address`.

## Expected Result

The API should reject empty or whitespace-only values for required text fields.

For example:

```text
name = "   "
address = "   "
```

should result in a validation error.

## Actual Result

The GraphQL input defines:

```python
name = graphene.String(required=True)
address = graphene.String(required=True)
```

However, `required=True` only requires the field to be present. It does not ensure that the value contains meaningful text.

The mutation then directly assigns the values:

```python
artist.name = input.name
artist.address = input.address
```

No trimming or content validation is performed.

## Impact

Invalid Artist profiles may be created containing:

* Blank names
* Whitespace-only names
* Blank addresses
* Whitespace-only addresses

This can affect search, display, reporting, and overall data quality.

## Root Cause

The API validates field presence but does not perform business-level string validation.

## Recommended Fix

Validate and normalize text values before saving.

For example:

```python
name = input.name.strip()
address = input.address.strip()

if not name:
    raise Exception("Artist name cannot be empty.")

if not address:
    raise Exception("Artist address cannot be empty.")

artist.name = name
artist.address = address
```

The same validation should be applied during both creation and update.

## Verification Plan

| Test                                 | Expected Result      |
| ------------------------------------ | -------------------- |
| Valid name and address               | Accepted             |
| Empty name                           | Rejected             |
| Whitespace-only name                 | Rejected             |
| Empty address                        | Rejected             |
| Whitespace-only address              | Rejected             |
| Name/address with surrounding spaces | Trimmed and accepted |

## Related Test Cases

**ARTIST-001 — Create Artist**

**ARTIST-004 — Update Artist**

**ARTIST-006 — Invalid Artist Data**

## Evidence Status

This finding was identified through source-code review.

**Runtime reproduction:** Not yet executed.

The exact behavior should be verified against the running application before classifying it as a confirmed runtime defect.
