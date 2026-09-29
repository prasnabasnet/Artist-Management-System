# BUG-009 — Music Can Be Reassigned to Any Artist

**Severity:** Medium
**Priority:** P2
**Status:** Open
**Detection Method:** Code Review
**Component:** GraphQL API — Music Management
**Affected Operation:** `updateMusic`

## Description

The `updateMusic` mutation allows an authorized user to change the Artist associated with an existing music record.

The mutation accepts `artist_id` as part of the update input and directly assigns the selected Artist to the music record.

If the application's business rules require an existing song to remain associated with its original Artist, this creates a data-integrity issue.

## Expected Result

Updating a music record should modify its editable metadata such as:

* Title
* Album name
* Genre

The Artist association should only be changed when the application explicitly supports transferring ownership and the user has permission to perform that action.

## Actual Result

`MusicInput` requires an `artist_id`:

```python id="n4c7qp"
class MusicInput(graphene.InputObjectType):
    artist_id = graphene.ID(required=True)
    title = graphene.String(required=True)
    album_name = graphene.String(required=True)
    genre = GenreEnum(required=True)
```

`UpdateMusic` then retrieves the supplied Artist:

```python id="s6v2kd"
artist = Artist.objects.get(
    id=input.artist_id,
    is_active=True
)
```

and directly changes the relationship:

```python id="j8m3xr"
music.artist = artist
music.title = input.title
music.album_name = input.album_name
music.genre = input.genre.value if hasattr(input.genre, "value") else input.genre
music.save()
```

There is no additional validation confirming that changing the Artist relationship is permitted.

## Impact

If Artist reassignment is not an intended business operation, an authorized manager could accidentally or intentionally associate a song with the wrong Artist.

This could cause:

* Incorrect Artist catalogues
* Incorrect ownership information
* Incorrect reporting
* Music appearing under the wrong Artist
* Data integrity problems

## Root Cause

`artist_id` is treated as an ordinary update field rather than as a potentially sensitive relationship change.

The mutation validates that the target Artist exists, but does not validate whether reassignment itself is permitted.

## Recommended Fix

If Artist reassignment is **not** part of the product requirements, remove `artist_id` from the normal update input and preserve the existing relationship.

Alternatively, if reassignment is a supported operation, introduce explicit authorization and validation for the transfer.

For example:

```python id="d2k7wp"
if input.artist_id != str(music.artist_id):
    raise Exception(
        "Changing the artist assignment is not allowed through this operation."
    )
```

A dedicated transfer operation could be used if reassignment is genuinely required.

## Verification Plan

| Test                              | Expected Result                                      |
| --------------------------------- | ---------------------------------------------------- |
| Update title of existing music    | Allowed                                              |
| Update album name                 | Allowed                                              |
| Update genre                      | Allowed                                              |
| Update music using same Artist ID | Allowed                                              |
| Change music to another Artist    | Rejected unless reassignment is explicitly supported |
| Non-existent Artist ID            | Rejected                                             |
| Inactive Artist ID                | Rejected                                             |

## Related Test Cases

**MUS-005 — Update Music**

**MUS-008 — Artist Association Validation**

**AUTHZ-017 — Unauthorized cross-artist data modification**

## Evidence Status

This finding was identified through source-code review.

**Runtime reproduction:** Not yet executed.

Whether Artist reassignment is actually a defect depends on the product requirement. It should be confirmed before marking this finding as a confirmed application defect.
