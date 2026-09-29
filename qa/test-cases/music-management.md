# Music Management Test Cases

## 1. Overview

This document contains functional, validation, authorization, negative, API, and regression test cases for the Music Management functionality of the Artist Management System.

The Music module allows authorized users to create and manage music records associated with artists. Artists can view their own music through the Artist Portal.

---

## 2. Roles Under Test

| Role             | Expected Music Access         |
| ---------------- | ----------------------------- |
| `super_admin`    | Create, view, manage music    |
| `artist_manager` | Create, view, manage music    |
| `artist`         | Read-only access to own music |

---

## 3. Test Cases

### MUS-001 — Create Music with Valid Data

**Priority:** High
**Type:** Functional

**Preconditions:**

* User is authenticated as `super_admin` or `artist_manager`.
* A valid artist exists.

**Test Data:**

```text
Artist: Test Artist One
Title: Test Song One
Album: Test Album
Genre: POP
```

**Steps:**

1. Authenticate as an authorized management user.
2. Execute the `createMusic` mutation.
3. Provide a valid `artistId`.
4. Provide a valid title, album name, and genre.
5. Submit the mutation.

**Expected Result:**

* Music record is created.
* Response contains the created music ID.
* Returned artist is the selected artist.
* No validation error is returned.

---

### MUS-002 — Create Music with Missing Title

**Priority:** High
**Type:** Validation / Negative

**Steps:**

1. Authenticate as an authorized management user.
2. Execute `createMusic`.
3. Omit the required title.

**Expected Result:**

* Request is rejected if title is required.
* Appropriate validation error is returned.
* No incomplete music record is created.

---

### MUS-003 — Create Music with Missing Artist

**Priority:** High
**Type:** Validation / Negative

**Steps:**

1. Authenticate as an authorized management user.
2. Execute `createMusic`.
3. Omit or provide an invalid `artistId`.

**Expected Result:**

* Request is rejected.
* Appropriate validation error is returned.
* No orphan music record is created.

---

### MUS-004 — Create Music with Non-existent Artist ID

**Priority:** High
**Type:** Negative

**Test Data:**

```text
artistId: non-existent ID
```

**Expected Result:**

* Mutation fails.
* Artist-not-found or equivalent validation error is returned.
* Music is not created.

---

### MUS-005 — Create Music with Invalid Genre

**Priority:** Medium
**Type:** Validation / Negative

**Test Data:**

```text
genre: INVALID_GENRE
```

**Expected Result:**

* Invalid genre is rejected.
* No music record is created.

Valid genres include:

```text
rock
pop
jazz
classical
hip_hop
rnb
country
blues
other
```

---

### MUS-006 — Artist Creates Music

**Priority:** High
**Type:** Authorization

**Preconditions:**

* Authenticate as an `artist`.

**Steps:**

1. Attempt to execute `createMusic`.

**Expected Result:**

* Operation is rejected.
* Artist cannot create or manage music through the management operation.

---

### MUS-007 — Artist Views Own Music

**Priority:** High
**Type:** Functional / Authorization

**Preconditions:**

* Artist account is linked to an Artist profile.
* Music exists for that artist.

**Steps:**

1. Authenticate as the artist.
2. Execute `myMusic`.
3. Request the music fields.

**Expected Result:**

* Only the authenticated artist's music is returned.
* Other artists' music is not exposed.

---

### MUS-008 — Artist Views Music Without Artist Profile

**Priority:** Medium
**Type:** Negative / Data Dependency

**Preconditions:**

* Authenticated account does not have an associated Artist profile.

**Steps:**

1. Authenticate.
2. Execute `myMusic`.

**Expected Result:**

* Application returns an appropriate error.
* No unrelated artist music is exposed.

**Current Observation:**

The current test account returned:

```text
No artist profile linked to this account.
```

with:

```json
{
  "data": {
    "myMusic": null
  }
}
```

**Classification:** Data/precondition verification required.

This should not automatically be treated as an application defect.

---

### MUS-009 — Retrieve All Music

**Priority:** High
**Type:** Functional / API

**Steps:**

1. Authenticate with an authorized account.
2. Execute:

```graphql
query {
  allMusic(first: 10, skip: 0) {
    totalRows
    rows {
      id
      title
      albumName
      genre
      artist {
        id
        name
      }
    }
  }
}
```

**Expected Result:**

* Music records are returned.
* `totalRows` represents the available records.
* Each music record contains its associated artist where applicable.

---

### MUS-010 — Music Pagination

**Priority:** Medium
**Type:** Functional

**Steps:**

1. Create or identify more than 10 music records.
2. Execute `allMusic(first: 10, skip: 0)`.
3. Execute `allMusic(first: 10, skip: 10)`.

**Expected Result:**

* First request returns the first page.
* Second request returns the next page.
* Records should not unexpectedly overlap.

---

### MUS-011 — Retrieve Music with Different Genres

**Priority:** Medium
**Type:** Functional

**Steps:**

1. Create music records using different supported genres.
2. Retrieve the records through `allMusic`.

**Expected Result:**

* Each record retains its assigned genre.
* Genre values are returned correctly.

---

### MUS-012 — Music Belongs to Correct Artist

**Priority:** High
**Type:** Integration

**Steps:**

1. Create an artist.
2. Create music using that artist's ID.
3. Retrieve the music.
4. Inspect the nested `artist` information.

**Expected Result:**

* Music is associated with the intended artist.
* Artist ID and artist name correspond to the selected artist.

---

### MUS-013 — Unauthenticated Music Access

**Priority:** High
**Type:** Security / Authorization

**Steps:**

1. Remove the JWT authentication header.
2. Attempt to execute a protected music operation.

**Expected Result:**

* Protected operation is rejected.
* No unauthorized protected data is returned.

---

### MUS-014 — Invalid JWT

**Priority:** High
**Type:** Security

**Steps:**

1. Send a fabricated or invalid JWT.
2. Execute a protected music query.

**Expected Result:**

* Request is rejected.
* Protected music data is not returned.

---

### MUS-015 — Artist Attempts to Access Another Artist's Music

**Priority:** Critical
**Type:** Authorization / Security

**Preconditions:**

* Artist A exists.
* Artist B exists.
* Both have music records.

**Steps:**

1. Authenticate as Artist A.
2. Attempt to retrieve Artist B's music through an artist-specific operation or manipulated identifier.

**Expected Result:**

* Artist A cannot access Artist B's private artist-specific music through the Artist Portal.
* Only authorized data is returned.

---

### MUS-016 — Duplicate Music Record

**Priority:** Medium
**Type:** Validation

**Steps:**

1. Create a music record.
2. Attempt to create the same record again.

**Expected Result:**

* Behavior follows the application's defined uniqueness rules.
* If duplicates are not allowed, the second request is rejected.
* If duplicates are allowed, both records should be handled consistently.

**Note:** The expected behavior must be confirmed against the actual model/schema requirements before classifying a duplicate as a defect.

---

### MUS-017 — Excessively Long Title

**Priority:** Low
**Type:** Validation / Negative

**Steps:**

1. Submit a title exceeding the model's allowed length.
2. Execute `createMusic`.

**Expected Result:**

* Input is rejected if it exceeds the defined field constraint.
* No invalid record is created.

---

### MUS-018 — Null or Empty Album Name

**Priority:** Medium
**Type:** Validation / Negative

**Steps:**

1. Submit a null or empty album name.
2. Execute `createMusic`.

**Expected Result:**

* Behavior follows the field's actual null/blank configuration.
* Invalid input is rejected where the field is required.

---

### MUS-019 — Management User Creates Music for Invalid Artist

**Priority:** High
**Type:** Negative / Authorization

**Steps:**

1. Authenticate as `artist_manager`.
2. Provide an invalid `artistId`.
3. Execute `createMusic`.

**Expected Result:**

* Request is rejected.
* No music record is created.

---

### MUS-020 — Regression — Existing Music Remains Accessible

**Priority:** High
**Type:** Regression

**Steps:**

1. Create an existing music record.
2. Perform an unrelated artist or user management operation.
3. Retrieve music again.

**Expected Result:**

* Existing music remains available.
* Artist association remains intact.
* No unrelated operation corrupts the music record.

---

## 4. GraphQL Operations Covered

### Create Music

```graphql
mutation {
  createMusic(
    input: {
      artistId: "1"
      title: "Song Title"
      albumName: "Album Name"
      genre: POP
    }
  ) {
    music {
      id
      title
    }
    message
  }
}
```

### Retrieve Music

```graphql
query {
  allMusic(first: 10, skip: 0) {
    totalRows
    rows {
      id
      title
      albumName
      genre
      artist {
        id
        name
      }
    }
  }
}
```

### Retrieve Artist's Own Music

```graphql
query {
  myMusic(first: 10, skip: 0) {
    totalRows
    rows {
      id
      title
      albumName
      genre
    }
  }
}
```

---

## 5. Test Data Dependencies

Music testing depends on the following relationship:

```text
User
  ↓
Artist
  ↓
Music
```

Therefore:

* A valid artist must exist before creating music.
* The artist ID must be valid.
* Artist-specific music testing requires the authenticated user to be linked to an Artist profile.
* Missing relationships should be classified as test-data/precondition issues until the expected application behavior is confirmed.

---

## 6. Execution Status

The test cases in this document define the required coverage.

They should only be marked `PASS`, `FAIL`, or `BLOCKED` after actual execution or verified code-level assessment.

No result should be recorded as an observed execution result without supporting evidence.
