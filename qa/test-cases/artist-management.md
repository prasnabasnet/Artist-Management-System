# Artist Management Test Cases

## 1. Create Artist

### TC-ARTIST-001 — Create artist with valid data

**Priority:** High
**Type:** Functional

**Precondition:** User is authenticated and has permission to create artists.

**Test Steps:**

1. Open the artist management page.
2. Select the option to add/create an artist.
3. Enter all required fields with valid data.
4. Submit the form.

**Expected Result:**

* The artist is successfully created.
* A success message is displayed.
* The new artist appears in the artist list.
* The stored data matches the submitted data.

---

### TC-ARTIST-002 — Create artist with missing required fields

**Priority:** High
**Type:** Validation

**Test Steps:**

1. Open the create artist form.
2. Leave one or more required fields empty.
3. Submit the form.

**Expected Result:**

* The artist is not created.
* Appropriate validation messages are displayed.
* No incomplete artist record is stored.

---

### TC-ARTIST-003 — Create artist with invalid data

**Priority:** High
**Type:** Negative / Validation

**Test Steps:**

1. Open the create artist form.
2. Enter invalid data into one or more fields.
3. Submit the form.

**Expected Result:**

* The system rejects the invalid data.
* Appropriate validation errors are displayed.
* The artist is not created.

---

### TC-ARTIST-004 — Create duplicate artist

**Priority:** Medium
**Type:** Validation

**Precondition:** An artist with the same unique information already exists.

**Test Steps:**

1. Open the create artist form.
2. Enter information that duplicates an existing artist.
3. Submit the form.

**Expected Result:**

* The system handles the duplicate according to the application's requirements.
* A suitable validation/error message is displayed if duplicates are not allowed.
* An unintended duplicate record is not created.

---

## 2. View Artist

### TC-ARTIST-005 — View artist list

**Priority:** High
**Type:** Functional

**Precondition:** Authenticated user has access to artist management.

**Test Steps:**

1. Open the artist management page.
2. View the artist list.

**Expected Result:**

* Artists are displayed correctly.
* Relevant artist information is visible.
* The list loads without errors.

---

### TC-ARTIST-006 — View individual artist details

**Priority:** High
**Type:** Functional

**Precondition:** At least one artist exists.

**Test Steps:**

1. Open the artist list.
2. Select an artist.
3. Open the artist details.

**Expected Result:**

* The selected artist's details are displayed.
* The displayed information matches the stored data.

---

### TC-ARTIST-007 — View non-existent artist

**Priority:** Medium
**Type:** Negative / API

**Test Steps:**

1. Request an artist using an ID that does not exist.

**Expected Result:**

* The system does not return unrelated artist data.
* An appropriate not-found response is returned, such as HTTP 404.

---

## 3. Update Artist

### TC-ARTIST-008 — Update artist with valid data

**Priority:** High
**Type:** Functional

**Precondition:** An existing artist is available and the user has update permission.

**Test Steps:**

1. Open an existing artist.
2. Select the edit/update option.
3. Modify one or more fields with valid data.
4. Save the changes.

**Expected Result:**

* The artist is successfully updated.
* A success message is displayed.
* The updated information is displayed correctly.

---

### TC-ARTIST-009 — Update artist with invalid data

**Priority:** High
**Type:** Validation

**Test Steps:**

1. Open an existing artist.
2. Enter invalid data into a field.
3. Save the changes.

**Expected Result:**

* The update is rejected.
* Validation errors are displayed.
* Invalid data is not stored.

---

### TC-ARTIST-010 — Update non-existent artist

**Priority:** Medium
**Type:** Negative / API

**Test Steps:**

1. Send an update request using an artist ID that does not exist.

**Expected Result:**

* The request fails.
* An appropriate not-found response is returned.
* No unrelated artist record is modified.

---

## 4. Delete Artist

### TC-ARTIST-011 — Delete existing artist

**Priority:** High
**Type:** Functional

**Precondition:** An existing artist is available and the user has delete permission.

**Test Steps:**

1. Open the artist list.
2. Select an existing artist.
3. Select Delete.
4. Confirm the deletion.

**Expected Result:**

* The artist is deleted or marked as deleted according to the application's design.
* The artist no longer appears in the active artist list.
* A success message is displayed.

---

### TC-ARTIST-012 — Cancel artist deletion

**Priority:** Medium
**Type:** Functional

**Test Steps:**

1. Select an artist.
2. Select Delete.
3. Cancel the confirmation dialog.

**Expected Result:**

* The artist is not deleted.
* The artist remains available.

---

### TC-ARTIST-013 — Delete non-existent artist

**Priority:** Medium
**Type:** Negative / API

**Test Steps:**

1. Send a delete request using an artist ID that does not exist.

**Expected Result:**

* The request is rejected appropriately.
* No existing artist is accidentally deleted.

---

## 5. Search and Filtering

### TC-ARTIST-014 — Search artist by valid name

**Priority:** Medium
**Type:** Functional

**Precondition:** Multiple artists exist.

**Test Steps:**

1. Open the artist list.
2. Enter an existing artist name in the search field.

**Expected Result:**

* Matching artists are displayed.
* Non-matching artists are excluded from the results.

---

### TC-ARTIST-015 — Search artist with no matching result

**Priority:** Low
**Type:** Negative

**Test Steps:**

1. Search for an artist name that does not exist.

**Expected Result:**

* No unrelated artists are displayed.
* An appropriate empty-result message or empty list is displayed.

---

### TC-ARTIST-016 — Search with partial artist name

**Priority:** Medium
**Type:** Functional

**Test Steps:**

1. Enter part of an existing artist's name.

**Expected Result:**

* Artists matching the search criteria are displayed according to the application's search behavior.

---

## 6. Authorization

### TC-ARTIST-017 — Unauthorized user attempts to create artist

**Priority:** High
**Type:** Security / Authorization

**Precondition:** User does not have artist-creation permission.

**Test Steps:**

1. Log in as the unauthorized user.
2. Attempt to create an artist.

**Expected Result:**

* The action is denied.
* The artist is not created.
* An appropriate authorization response is returned.

---

### TC-ARTIST-018 — Unauthorized user attempts to update artist

**Priority:** High
**Type:** Security / Authorization

**Test Steps:**

1. Log in as a user without update permission.
2. Attempt to update an artist.

**Expected Result:**

* The update is denied.
* Existing artist data remains unchanged.

---

### TC-ARTIST-019 — Unauthorized user attempts to delete artist

**Priority:** Critical
**Type:** Security / Authorization

**Test Steps:**

1. Log in as a user without delete permission.
2. Attempt to delete an artist.

**Expected Result:**

* The deletion is denied.
* The artist remains available.

---

## 7. API Validation

### TC-ARTIST-020 — Create artist using invalid request body

**Priority:** High
**Type:** API / Negative

**Test Steps:**

1. Send a create-artist API request with missing or invalid fields.
2. Submit the request.

**Expected Result:**

* The API rejects the request.
* An appropriate HTTP status code is returned, such as 400.
* Validation errors identify the problematic fields.

---

### TC-ARTIST-021 — Request artist endpoint without authentication

**Priority:** Critical
**Type:** API / Security

**Test Steps:**

1. Send a request to a protected artist endpoint without authentication.

**Expected Result:**

* The request is rejected.
* Protected artist data is not exposed.

---

## 8. Regression Checks

After artist-management changes or bug fixes:

* Verify artist creation.
* Verify artist listing.
* Verify artist details.
* Verify artist updates.
* Verify artist deletion.
* Verify search and filtering.
* Verify validation.
* Verify authorization.
* Verify protected API endpoints.
