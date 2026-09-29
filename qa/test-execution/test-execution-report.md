# QA Test Execution Report

## 1. Execution Overview

**Project:** Artist Management System
**Execution Type:** Source-Code Analysis / Simulated Execution
**Environment:** Local development environment
**Testing Areas:** Authentication, User Management, Artist Management, Music Management, Authorization

> **Important:** This report contains simulated results derived from the supplied application source code. These results must not be represented as actual runtime execution results.

---

## 2. Execution Summary

| Metric                                  | Result |
| --------------------------------------- | -----: |
| Total Test Cases Assessed               |     74 |
| Simulated Pass                          |     54 |
| Simulated Fail                          |     14 |
| Blocked / Requires Runtime Verification |      6 |
| Total                                   |     74 |

### Execution Status

```text
PASS      54
FAIL      14
BLOCKED    6
----------------
TOTAL     74
```

---

## 3. Authentication Testing

| ID       | Test Case                                  | Result  |
| -------- | ------------------------------------------ | ------- |
| AUTH-001 | Valid login                                | PASS    |
| AUTH-002 | Invalid password                           | PASS    |
| AUTH-003 | Non-existent user                          | PASS    |
| AUTH-004 | Empty credentials                          | PASS    |
| AUTH-005 | Protected operation without authentication | PASS    |
| AUTH-006 | Artist accessing restricted operation      | PASS    |
| AUTH-007 | Logout                                     | PASS    |
| AUTH-008 | Access after logout                        | PASS    |
| AUTH-009 | Invalid authentication token               | BLOCKED |
| AUTH-010 | Missing authentication token               | PASS    |

**Authentication assessment:** Core authentication flow is implemented. Token-expiration and some validation behavior require runtime verification.

---

## 4. User Management Testing

| ID       | Test Case                              | Result  |
| -------- | -------------------------------------- | ------- |
| USER-001 | Create Artist user                     | PASS    |
| USER-002 | Create user as Super Admin             | PASS    |
| USER-003 | Artist Manager creates Artist          | PASS    |
| USER-004 | Artist Manager creates restricted role | PASS    |
| USER-005 | Artist creates user                    | PASS    |
| USER-006 | Duplicate email                        | PASS    |
| USER-007 | Retrieve current user                  | PASS    |
| USER-008 | Retrieve Artist users with permission  | PASS    |
| USER-009 | Unauthorized Artist-user listing       | PASS    |
| USER-010 | Weak password                          | FAIL    |
| USER-011 | Invalid email format                   | BLOCKED |

**Findings:** Password validation is not explicitly enforced in the mutation implementation. Email validation requires runtime/configuration verification.

---

## 5. Artist Management Testing

| ID         | Test Case                              | Result |
| ---------- | -------------------------------------- | ------ |
| ARTIST-001 | Create Artist                          | PASS   |
| ARTIST-002 | Create Artist without authentication   | PASS   |
| ARTIST-003 | Create Artist as unauthorized Artist   | PASS   |
| ARTIST-004 | Retrieve Artist by ID                  | PASS   |
| ARTIST-005 | Update Artist                          | PASS   |
| ARTIST-006 | Negative Artist values                 | FAIL   |
| ARTIST-007 | Future date of birth                   | FAIL   |
| ARTIST-008 | Empty Artist fields                    | FAIL   |
| ARTIST-009 | Duplicate Artist profile assignment    | FAIL   |
| ARTIST-010 | Delete Artist                          | PASS   |
| ARTIST-011 | Access own Artist profile              | PASS   |
| ARTIST-012 | Artist accesses another profile        | FAIL   |
| ARTIST-013 | Artist accesses all Artist records     | FAIL   |
| ARTIST-014 | Artist Manager accesses Artist records | PASS   |
| ARTIST-015 | Search Artist                          | PASS   |
| ARTIST-016 | Artist pagination                      | PASS   |

---

## 6. Music Management Testing

| ID      | Test Case                              | Result  |
| ------- | -------------------------------------- | ------- |
| MUS-001 | Create Music                           | PASS    |
| MUS-002 | Create Music without authentication    | PASS    |
| MUS-003 | Artist creates Music                   | PASS    |
| MUS-004 | Artist Manager creates Music           | PASS    |
| MUS-005 | Invalid Artist ID                      | PASS    |
| MUS-006 | Update Music                           | PASS    |
| MUS-007 | Delete Music                           | PASS    |
| MUS-008 | Empty Music title                      | FAIL    |
| MUS-009 | Empty album name                       | FAIL    |
| MUS-010 | Retrieve Music by ID                   | PASS    |
| MUS-011 | Artist accesses another Artist's Music | FAIL    |
| MUS-012 | Artist accesses all Music              | FAIL    |
| MUS-013 | Search Music                           | PASS    |
| MUS-014 | Music pagination                       | PASS    |
| MUS-015 | Invalid authentication                 | BLOCKED |
| MUS-016 | Music reassignment                     | FAIL    |
| MUS-017 | Inactive Music excluded                | PASS    |

---

## 7. Authorization Testing

| ID        | Test Case                              | Result  |
| --------- | -------------------------------------- | ------- |
| AUTHZ-001 | Super Admin access                     | PASS    |
| AUTHZ-002 | Artist Manager access                  | PASS    |
| AUTHZ-003 | Artist restricted mutation access      | PASS    |
| AUTHZ-004 | Artist accesses another Artist profile | FAIL    |
| AUTHZ-005 | Artist accesses all Artists            | FAIL    |
| AUTHZ-006 | Artist accesses own profile            | PASS    |
| AUTHZ-007 | Artist accesses another Artist's Music | FAIL    |
| AUTHZ-008 | Artist accesses all Music              | FAIL    |
| AUTHZ-009 | Unauthenticated Artist query           | PASS    |
| AUTHZ-010 | Unauthenticated Music query            | PASS    |
| AUTHZ-011 | Unauthorized Artist creation           | PASS    |
| AUTHZ-012 | Unauthorized Music creation            | PASS    |
| AUTHZ-013 | Artist attempts Artist update          | PASS    |
| AUTHZ-014 | Artist attempts Music update           | PASS    |
| AUTHZ-015 | Artist attempts Artist deletion        | PASS    |
| AUTHZ-016 | Artist attempts Music deletion         | PASS    |
| AUTHZ-017 | Artist Manager role restriction        | PASS    |
| AUTHZ-018 | Invalid JWT                            | BLOCKED |
| AUTHZ-019 | Cross-user object access               | FAIL    |
| AUTHZ-020 | Privilege escalation attempt           | PASS    |

---

## 8. Defects Identified

The simulated assessment resulted in the following findings:

| Bug ID  | Area                        | Severity | Status |
| ------- | --------------------------- | -------- | ------ |
| BUG-001 | Artist Authorization        | High     | Open   |
| BUG-002 | Music Authorization         | High     | Open   |
| BUG-003 | Artist Object Authorization | High     | Open   |
| BUG-004 | Music Object Authorization  | High     | Open   |
| BUG-005 | Artist Data Integrity       | Medium   | Open   |
| BUG-006 | Artist Validation           | Medium   | Open   |
| BUG-007 | DOB Validation              | Medium   | Open   |
| BUG-008 | Artist Input Validation     | Medium   | Open   |
| BUG-009 | Music Authorization         | Medium   | Open   |
| BUG-010 | Music Input Validation      | Medium   | Open   |
| BUG-011 | Password Validation         | Medium   | Open   |
| BUG-012 | Email Validation            | Medium   | Open   |

---

## 9. Environment / Configuration Observation

During integration testing, the frontend initially attempted to send GraphQL requests to:

```text
http://localhost:3000/graphql
```

The request returned:

```text
404 Not Found
```

The configured Django GraphQL endpoint was:

```text
http://localhost:8001/graphql/
```

After configuring the frontend API URL accordingly, the request successfully reached the backend.

This was treated as an environment/configuration issue rather than a product defect.

---

## 10. Blocked Tests

The following areas require actual runtime verification:

* Exact JWT error behavior
* Password validator configuration
* Email validation behavior
* Database-level integrity errors
* Browser/UI behavior
* Token expiration behavior

These cases should remain open for future runtime execution rather than being marked as confirmed defects.

---

## 11. Overall Assessment

The source-code assessment indicates that the application's core authentication and CRUD structure is present.

The primary risk area is authorization.

Several authenticated GraphQL operations do not appear to enforce sufficient role or ownership restrictions. This means authentication and authorization should be treated as separate test concerns.

Input validation is another significant area requiring attention.

---

## 12. Next QA Cycle

After development fixes are applied:

1. Execute all failed authorization cases against the running application.
2. Verify ownership restrictions.
3. Execute validation cases with invalid and boundary values.
4. Capture actual runtime results.
5. Retest each corresponding defect.
6. Run regression tests.
7. Update defect statuses.
8. Produce the final release-readiness assessment.

---

## 13. Execution Limitation

This document is a **portfolio QA assessment based on source-code analysis and simulated execution**.

It does not claim that all listed test cases were manually executed against the live application.

Actual runtime execution is required to confirm the simulated findings.
