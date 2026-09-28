# Authentication Test Cases

## 1. Login

### TC-AUTH-001 — Login with valid credentials

**Priority:** High
**Type:** Functional
**Precondition:** A valid user account exists.

**Test Steps:**

1. Open the login page.
2. Enter a valid email/username.
3. Enter the correct password.
4. Click the Login button.

**Expected Result:**

* The user is successfully authenticated.
* The user is redirected to the appropriate page/dashboard.
* Authentication information is stored correctly.

**Expected Status:** PASS

---

### TC-AUTH-002 — Login with incorrect password

**Priority:** High
**Type:** Negative

**Precondition:** A valid user account exists.

**Test Steps:**

1. Open the login page.
2. Enter a valid email/username.
3. Enter an incorrect password.
4. Click the Login button.

**Expected Result:**

* Login fails.
* An appropriate error message is displayed.
* The user is not granted access to protected resources.

---

### TC-AUTH-003 — Login with non-existent user

**Priority:** High
**Type:** Negative

**Test Steps:**

1. Open the login page.
2. Enter a username/email that does not exist.
3. Enter any password.
4. Click Login.

**Expected Result:**

* Authentication fails.
* An appropriate error message is displayed.
* The user remains unauthenticated.

---

### TC-AUTH-004 — Login with empty credentials

**Priority:** Medium
**Type:** Validation

**Test Steps:**

1. Open the login page.
2. Leave the username/email field empty.
3. Leave the password field empty.
4. Click Login.

**Expected Result:**

* Login is not submitted successfully.
* Required-field validation messages are displayed.

---

### TC-AUTH-005 — Login with empty password

**Priority:** Medium
**Type:** Validation

**Test Steps:**

1. Enter a valid username/email.
2. Leave the password field empty.
3. Click Login.

**Expected Result:**

* Login fails.
* Password validation is displayed.
* The user is not authenticated.

---

### TC-AUTH-006 — Login with empty username/email

**Priority:** Medium
**Type:** Validation

**Test Steps:**

1. Leave the username/email field empty.
2. Enter a valid password.
3. Click Login.

**Expected Result:**

* Login fails.
* Username/email validation is displayed.
* The user is not authenticated.

---

## 2. Authorization

### TC-AUTH-007 — Access protected resource without authentication

**Priority:** Critical
**Type:** Security / Authorization

**Test Steps:**

1. Log out of the application.
2. Attempt to access a protected page or API endpoint directly.

**Expected Result:**

* Access is denied.
* The user is redirected to the login page or receives an appropriate unauthorized response such as HTTP 401.

---

### TC-AUTH-008 — Access restricted functionality with insufficient permissions

**Priority:** High
**Type:** Authorization

**Precondition:** A user with limited permissions exists.

**Test Steps:**

1. Log in as the limited-permission user.
2. Attempt to access a restricted feature.
3. Attempt to perform a restricted API operation if applicable.

**Expected Result:**

* The restricted action is denied.
* The system returns an appropriate authorization response such as HTTP 403.
* No unauthorized data is modified.

---

## 3. Logout

### TC-AUTH-009 — Logout from authenticated session

**Priority:** High
**Type:** Functional

**Precondition:** User is logged in.

**Test Steps:**

1. Log in successfully.
2. Click the Logout button.

**Expected Result:**

* The user is logged out.
* Protected resources can no longer be accessed using the logged-out session/token.
* The user is redirected appropriately.

---

### TC-AUTH-010 — Access protected resource after logout

**Priority:** High
**Type:** Security

**Precondition:** User has successfully logged out.

**Test Steps:**

1. Log in.
2. Log out.
3. Attempt to access a protected page or API endpoint.

**Expected Result:**

* Access is denied.
* The user must authenticate again before accessing protected resources.

---

## 4. Authentication Token / Session

### TC-AUTH-011 — Access API with valid authentication token

**Priority:** High
**Type:** API / Authentication

**Precondition:** A valid authentication token is available.

**Test Steps:**

1. Send a request to a protected API endpoint.
2. Include the valid authentication token.

**Expected Result:**

* The API accepts the request.
* The user receives the appropriate response based on their permissions.

---

### TC-AUTH-012 — Access API with invalid authentication token

**Priority:** High
**Type:** API / Security

**Test Steps:**

1. Send a request to a protected API endpoint.
2. Provide an invalid or malformed authentication token.

**Expected Result:**

* The request is rejected.
* The API returns an appropriate authentication error, such as HTTP 401.
* Protected data is not returned.

---

### TC-AUTH-013 — Access API without authentication token

**Priority:** Critical
**Type:** API / Security

**Test Steps:**

1. Send a request to a protected API endpoint.
2. Do not provide authentication credentials.

**Expected Result:**

* The request is rejected.
* The API returns an appropriate unauthorized response.
* Protected data is not exposed.

---

## 5. Regression Checks

After authentication-related changes or bug fixes:

* Verify valid login still works.
* Verify invalid login is rejected.
* Verify protected endpoints remain protected.
* Verify authorization rules still work.
* Verify logout still works.
* Verify invalid/expired authentication credentials are rejected.
