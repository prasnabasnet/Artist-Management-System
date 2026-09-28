# User Management Test Cases

## 1. Create User

### TC-USER-001 — Create user with valid data

**Priority:** High
**Type:** Functional

**Precondition:** Authenticated user has permission to create users.

**Test Steps:**

1. Open the user management page.
2. Select the option to create a user.
3. Enter valid user information.
4. Submit the form.

**Expected Result:**

* The user is successfully created.
* A success message is displayed.
* The new user appears in the user list.
* The stored information matches the submitted data.

---

### TC-USER-002 — Create user with missing required fields

**Priority:** High
**Type:** Validation

**Test Steps:**

1. Open the create-user form.
2. Leave one or more required fields empty.
3. Submit the form.

**Expected Result:**

* The user is not created.
* Appropriate validation messages are displayed.

---

### TC-USER-003 — Create user with invalid email

**Priority:** High
**Type:** Validation

**Test Steps:**

1. Open the create-user form.
2. Enter an invalid email address.
3. Enter valid values for the other required fields.
4. Submit the form.

**Expected Result:**

* The system rejects the invalid email.
* An appropriate validation message is displayed.
* The user is not created.

---

### TC-USER-004 — Create user with duplicate email

**Priority:** High
**Type:** Validation

**Precondition:** A user with the same email already exists.

**Test Steps:**

1. Open the create-user form.
2. Enter an email address already registered in the system.
3. Enter valid values for the remaining fields.
4. Submit the form.

**Expected Result:**

* The system rejects the duplicate email.
* An appropriate error message is displayed.
* An unintended duplicate user is not created.

---

## 2. View Users

### TC-USER-005 — View user list

**Priority:** High
**Type:** Functional

**Precondition:** User has permission to view users.

**Test Steps:**

1. Open the user management page.
2. View the user list.

**Expected Result:**

* Users are displayed correctly.
* Relevant user information is shown.
* The page loads without errors.

---

### TC-USER-006 — View individual user

**Priority:** High
**Type:** Functional

**Precondition:** At least one user exists.

**Test Steps:**

1. Open the user list.
2. Select a user.
3. Open the user's details.

**Expected Result:**

* The selected user's details are displayed.
* The information matches the stored data.

---

### TC-USER-007 — View non-existent user

**Priority:** Medium
**Type:** Negative / API

**Test Steps:**

1. Request a user using an ID that does not exist.

**Expected Result:**

* An appropriate not-found response is returned.
* No unrelated user information is returned.

---

## 3. Update User

### TC-USER-008 — Update user with valid data

**Priority:** High
**Type:** Functional

**Precondition:** An existing user is available and the current user has update permission.

**Test Steps:**

1. Open an existing user.
2. Select Edit.
3. Modify one or more fields with valid data.
4. Save the changes.

**Expected Result:**

* The user is successfully updated.
* The updated information is displayed correctly.
* The changes are persisted.

---

### TC-USER-009 — Update user with invalid data

**Priority:** High
**Type:** Validation

**Test Steps:**

1. Open an existing user.
2. Enter invalid data.
3. Save the changes.

**Expected Result:**

* The update is rejected.
* Appropriate validation errors are displayed.
* Invalid data is not stored.

---

### TC-USER-010 — Update non-existent user

**Priority:** Medium
**Type:** Negative / API

**Test Steps:**

1. Send an update request using a user ID that does not exist.

**Expected Result:**

* The request fails appropriately.
* A not-found response is returned.
* No existing user is modified.

---

## 4. Delete User

### TC-USER-011 — Delete existing user

**Priority:** High
**Type:** Functional

**Precondition:** An existing user is available and the current user has delete permission.

**Test Steps:**

1. Open the user list.
2. Select an existing user.
3. Select Delete.
4. Confirm the deletion.

**Expected Result:**

* The user is deleted or deactivated according to the application's design.
* The user no longer appears in the active user list.
* A success message is displayed.

---

### TC-USER-012 — Cancel user deletion

**Priority:** Medium
**Type:** Functional

**Test Steps:**

1. Select a user.
2. Select Delete.
3. Cancel the confirmation dialog.

**Expected Result:**

* The user is not deleted.
* The user remains available.

---

### TC-USER-013 — Delete non-existent user

**Priority:** Medium
**Type:** Negative / API

**Test Steps:**

1. Send a delete request using a user ID that does not exist.

**Expected Result:**

* The request is rejected appropriately.
* No existing user is affected.

---

## 5. User Search

### TC-USER-014 — Search user by valid name

**Priority:** Medium
**Type:** Functional

**Precondition:** Multiple users exist.

**Test Steps:**

1. Open the user list.
2. Search for an existing user's name.

**Expected Result:**

* Matching users are displayed.
* Non-matching users are excluded.

---

### TC-USER-015 — Search for non-existent user

**Priority:** Low
**Type:** Negative

**Test Steps:**

1. Search for a user who does not exist.

**Expected Result:**

* No unrelated users are displayed.
* An appropriate empty-result response is displayed.

---

## 6. User Roles and Permissions

### TC-USER-016 — Assign valid user role

**Priority:** High
**Type:** Functional / Authorization

**Precondition:** User has permission to manage roles.

**Test Steps:**

1. Open an existing user.
2. Select a valid role.
3. Save the changes.
4. Log in or refresh the user's permissions where applicable.

**Expected Result:**

* The selected role is saved.
* The user's available functionality matches the assigned permissions.

---

### TC-USER-017 — Unauthorized user attempts to create user

**Priority:** High
**Type:** Security / Authorization

**Precondition:** Current user does not have user-creation permission.

**Test Steps:**

1. Log in as the unauthorized user.
2. Attempt to create a new user.

**Expected Result:**

* The action is denied.
* No new user is created.

---

### TC-USER-018 — Unauthorized user attempts to update user

**Priority:** High
**Type:** Security / Authorization

**Precondition:** Current user does not have update permission.

**Test Steps:**

1. Log in as the unauthorized user.
2. Attempt to modify another user's information.

**Expected Result:**

* The update is denied.
* Existing user information remains unchanged.

---

### TC-USER-019 — Unauthorized user attempts to delete user

**Priority:** Critical
**Type:** Security / Authorization

**Precondition:** Current user does not have delete permission.

**Test Steps:**

1. Log in as the unauthorized user.
2. Attempt to delete another user.

**Expected Result:**

* The deletion is denied.
* The target user remains available.

---

## 7. API Security

### TC-USER-020 — Access user API without authentication

**Priority:** Critical
**Type:** API / Security

**Test Steps:**

1. Send a request to a protected user endpoint without authentication.

**Expected Result:**

* The request is rejected.
* User information is not exposed.

---

### TC-USER-021 — Access user API with invalid authentication

**Priority:** Critical
**Type:** API / Security

**Test Steps:**

1. Send a request to a protected user endpoint.
2. Provide an invalid authentication token.

**Expected Result:**

* The request is rejected.
* An appropriate authentication error is returned.
* Protected user information is not exposed.

---

## 8. Regression Checks

After user-management changes or bug fixes:

* Verify user creation.
* Verify user listing.
* Verify user details.
* Verify user updates.
* Verify user deletion/deactivation.
* Verify user search.
* Verify role assignment.
* Verify authorization.
* Verify protected API endpoints.
* Verify validation and error handling.
