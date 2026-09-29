# BUG-010 — Empty Music Text Fields Are Not Validated

**Severity:** Medium
**Priority:** P2
**Status:** Open
**Detection Method:** Code Review
**Component:** GraphQL API — Music Management
**Affected Operations:** `createMusic`, `updateMusic`

## Description

The Music GraphQL input marks `title` and `album_name` as required, but there is no validation to ensure that these fields contain meaningful text.

Whitespace-only values may therefore be accepted by the application.

## Expected Result

The API should reject empty or whitespace-only values for required text fields.

For example:

```text
title = "   "
albumName = "   "
```

should return a validation error.

## Actual Result

The GraphQL input defines:

```python id="v5n2kx"
class MusicInput(graphene.InputObjectType):
    artist_id = graphene.ID(required=True)
    title = graphene.String(required=True)
    album_name = graphene.String(required=True)
    genre = GenreEnum(required=True)
```

However, `required=True` only ensures that the fields are supplied.

The `createMusic` mutation directly passes the values to the model:

```python id="a7m4qp"
music = Music.objects.create(
    artist=artist,
    title=input.title,
    album_name=input.album_name,
    genre=input.genre.value if hasattr(input.genre, "value") else input.genre,
)
```

There is no trimming or content validation.

The same behavior exists in `updateMusic`:

```python id="k9r3wd"
music.title = input.title
music.album_name = input.album_name
```

## Impact

Invalid music records may be stored with blank or whitespace-only titles and album names.

This can affect:

* Music catalogue quality
* Search functionality
* UI display
* Reports
* Duplicate detection
* Data consistency

## Root Cause

The GraphQL layer checks whether the fields are present but does not validate their actual content.

## Recommended Fix

Trim and validate the text fields before saving.

For example:

```python id="m2x8qa"
title = input.title.strip()
album_name = input.album_name.strip()

if not title:
    raise Exception("Music title cannot be empty.")

if not album_name:
    raise Exception("Album name cannot be empty.")
```

The same validation should be applied to both creation and update.

## Verification Plan

| Test                           | Expected Result      |
| ------------------------------ | -------------------- |
| Valid title and album name     | Accepted             |
| Empty title                    | Rejected             |
| Whitespace-only title          | Rejected             |
| Empty album name               | Rejected             |
| Whitespace-only album name     | Rejected             |
| Values with surrounding spaces | Trimmed and accepted |

## Related Test Cases

**MUS-001 — Create Music**

**MUS-005 — Update Music**

**MUS-006 — Invalid Music Data**

## Evidence Status

This finding was identified through source-code review.

**Runtime reproduction:** Not yet executed.

The behavior should be verified against the running application before marking it as a confirmed runtime defect.
