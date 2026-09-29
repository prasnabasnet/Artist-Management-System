# Authorization Test Cases

## 1. Overview

This document defines authorization and role-based access control (RBAC) test cases for the Artist Management System.

The system contains three primary roles:

* `super_admin`
* `artist_manager`
* `artist`

The purpose of these tests is to verify that users can perform only the operations permitted by their assigned role.

---

## 2. Authorization Matrix

| Operation                            | Super Admin |            Artist Manager           | Artist |
| ------------------------------------ | :---------: | :---------------------------------: | :----: |
| Login                                |      ✅      |                  ✅                  |    ✅   |
| View dashboard                       |      ✅      |                  ✅                  |    ❌   |
| Create user                          |      ✅      |                  ✅                  |    ❌   |
| Manage super admins                  |      ✅      |                  ❌                  |    ❌   |
| Manage artist managers               |      ✅      |                  ❌                  |    ❌   |
| Create artist                        |      ✅      |                  ✅                  |    ❌   |
| View all artists                     |      ✅      |                  ✅                  |    ❌   |
| Update artist                        |      ✅      |                  ✅                  |    ❌   |
| Delete artist                        |      ✅      |                  ✅                  |    ❌   |
| Create music                         |      ✅      |                  ✅                  |    ❌   |
| View all music                       |      ✅      |                  ✅                  |    ❌   |
| Manage music                         |      ✅      |                  ✅                  |    ❌   |
| View own artist profile              |      ❌      |                  ❌                  |    ✅   |
| View own music                       |      ❌      |                  ❌                  |    ✅   |
| Access another artist's private data |      ❌      | According to management permissions |    ❌   |

> The matrix represents the intended behavior described by the project's roles and user flows. Exact implementation behavior should be confirmed during execution.

---

# 3. Super Admin Authorization

## AUTHZ-001 — Super Admin Creates Artist Manager

**Priority:** High
**Type:** Authorization / Functional

**Preconditions:**

* Authenticated as `super_admin`.

**Steps:**

1. Execute `createUser`.
2. Specify `ARTIST_MANAGER` as the role.
3. Submit the mutation.

**Expected Result:**

* Artist manager account is created successfully.

---

## AUTHZ-002 — Super Admin Creates Artist

**Priority:** High
**Type:** Authorization

**Steps:**

1. Authenticate as `super_admin`.
2. Execute `createArtist`.
3. Provide valid artist data and a valid user ID.

**Expected Result:**

* Artist profile is created.
* Artist is linked to the specified user.

---

## AUTHZ-003 — Super Admin Creates Music

**Priority:** High
**Type:** Authorization

**Steps:**

1. Authenticate as `super_admin`.
2. Execute `createMusic` with valid data.

**Expected Result:**

* Music record is created successfully.

---

# 4. Artist Manager Authorization

## AUTHZ-004 — Artist Manager Creates Artist

**Priority:** High
**Type:** Authorization

**Steps:**

1. Authenticate as `artist_manager`.
2. Execute `createArtist`.
3. Provide valid artist data.

**Expected Result:**

* Artist is created successfully.

---

## AUTHZ-005 — Artist Manager Creates Music

**Priority:** High
**Type:** Authorization

**Steps:**

1. Authenticate as `artist_manager`.
2. Execute `createMusic`.

**Expected Result:**

* Music record is created successfully.

---

## AUTHZ-006 — Artist Manager Creates Another Manager

**Priority:** High
**Type:** Authorization / Security

**Steps:**

1. Authenticate as `artist_manager`.
2. Attempt to create another `artist_manager`.

**Expected Result:**

* Operation is rejected if the role definition restricts manager creation to `super_admin`.
* No unauthorized management account is created.

---

## AUTHZ-007 — Artist Manager Creates Super Admin

**Priority:** Critical
**Type:** Authorization / Security

**Steps:**

1. Authenticate as `artist_manager`.
2. Attempt to create a `super_admin`.

**Expected Result:**

* Operation is rejected.
* No super-admin account is created.

---

# 5. Artist Authorization

## AUTHZ-008 — Artist Accesses Own Profile

**Priority:** High
**Type:** Authorization / Functional

**Preconditions:**

* Artist account is linked to an Artist profile.

**Steps:**

1. Authenticate as `artist`.
2. Navigate to the Artist Portal.
3. Request `myArtistProfile`.

**Expected Result:**

* The artist's own profile is returned.

---

## AUTHZ-009 — Artist Accesses Own Music

**Priority:** High
**Type:** Authorization / Functional

**Preconditions:**

* Artist has an associated Artist profile.
* Music exists for the artist.

**Steps:**

1. Authenticate as the artist.
2. Execute `myMusic`.

**Expected Result:**

* Only the authenticated artist's music is returned.

---

## AUTHZ-010 — Artist Attempts to Create Artist

**Priority:** Critical
**Type:** Authorization / Security

**Steps:**

1. Authenticate as `artist`.
2. Execute `createArtist`.

**Expected Result:**

* Operation is rejected.
* Artist cannot create another artist profile.

---

## AUTHZ-011 — Artist Attempts to Create Music

**Priority:** Critical
**Type:** Authorization / Security

**Steps:**

1. Authenticate as `artist`.
2. Execute `createMusic`.

**Expected Result:**

* Operation is rejected.
* Artist cannot create management-level music records.

---

## AUTHZ-012 — Artist Attempts to Create User

**Priority:** Critical
**Type:** Authorization / Security

**Steps:**

1. Authenticate as `artist`.
2. Execute `createUser`.

**Expected Result:**

* Operation is rejected.
* No user account is created.

---

## AUTHZ-013 — Artist Attempts to View All Artists

**Priority:** High
**Type:** Authorization

**Steps:**

1. Authenticate as `artist`.
2. Execute `allArtist`.

**Expected Result:**

* Operation is rejected if all-artist management access is restricted to management roles.
* Artist should only access their own profile through the artist portal.

---

## AUTHZ-014 — Artist Attempts to View All Music

**Priority:** High
**Type:** Authorization

**Steps:**

1. Authenticate as `artist`.
2. Execute `allMusic`.

**Expected Result:**

* Operation is rejected if management-level music listing is restricted.
* Artist should use `myMusic` for their own music.

---

# 6. Cross-Role Access Tests

## AUTHZ-015 — Artist Attempts to Access Another Artist's Profile

**Priority:** Critical
**Type:** Security

**Preconditions:**

* Artist A exists.
* Artist B exists.

**Steps:**

1. Authenticate as Artist A.
2. Attempt to retrieve Artist B's profile through a user-controlled identifier or management operation.

**Expected Result:**

* Artist A cannot access another artist's restricted profile data.

---

## AUTHZ-016 — Artist Attempts to Access Another Artist's Music

**Priority:** Critical
**Type:** Security

**Preconditions:**

* Artist A has music.
* Artist B has music.

**Steps:**

1. Authenticate as Artist A.
2. Attempt to retrieve Artist B's music.

**Expected Result:**

* Artist A cannot access Artist B's restricted music through artist-specific access.

---

## AUTHZ-017 — Unauthenticated User Accesses Protected Operation

**Priority:** Critical
**Type:** Authentication / Authorization

**Steps:**

1. Do not provide a JWT.
2. Execute a protected GraphQL operation.

**Expected Result:**

* Request is rejected.
* Protected data is not returned.

---

## AUTHZ-018 — Invalid JWT Access

**Priority:** Critical
**Type:** Security

**Steps:**

1. Provide an invalid JWT.
2. Execute a protected GraphQL operation.

**Expected Result:**

* Request is rejected.
* Protected data is not returned.

---

## AUTHZ-019 — Role Manipulation Attempt

**Priority:** Critical
**Type:** Security

**Steps:**

1. Authenticate as a lower-privileged user.
2. Attempt to submit a request that assigns the account a higher-privileged role.
3. Attempt to access operations belonging to the higher role.

**Expected Result:**

* User cannot elevate their own privileges through client-controlled input.
* Server-side authorization remains authoritative.

---

## AUTHZ-020 — Management Operation After Logout

**Priority:** High
**Type:** Security / Regression

**Steps:**

1. Authenticate successfully.
2. Log out.
3. Attempt a protected management operation using the previous authentication state.

**Expected Result:**

* Protected operation is rejected once the authentication state is no longer valid.

---

# 7. Authorization Test Data

Use separate synthetic accounts:

```text
superadmin@test.example
manager@test.example
artist1@test.example
artist2@test.example
```

Do not store their real passwords or JWT tokens in the repository.

Required relationships:

```text
super_admin
    ↓
Management permissions

artist_manager
    ↓
Artist + Music management

artist
    ↓
Own Artist Profile
    ↓
Own Music
```

---

# 8. Security Expectations

Authorization must be enforced by the backend.

The frontend hiding a button is not sufficient protection.

For example:

```text
Artist UI
   ↓
"Create Artist" button hidden
```

does **not** prove that the operation is secure.

The important test is:

```text
Artist
   ↓
Direct GraphQL mutation
   ↓
createArtist
   ↓
Backend authorization
   ↓
Request rejected
```

The same principle applies to `createUser`, `createMusic`, `allArtist`, and other protected operations.

---

# 9. Execution Status

These cases define the required authorization coverage.

They should only be marked `PASS`, `FAIL`, or `BLOCKED` after actual execution or verified code-level analysis.

A rejected request should be classified as a passing authorization test when the rejection matches the application's documented access-control requirements.
