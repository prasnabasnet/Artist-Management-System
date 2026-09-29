# Final QA Report

## Artist Management System

---

## 1. Project Overview

**Project:** Artist Management System
**Testing Area:** Web Application / GraphQL API
**QA Approach:** Manual QA Planning, Source-Code Review, Functional Testing Design, Authorization Testing, Negative Testing, and Simulated Execution
**Testing Status:** QA Assessment Completed
**Execution Basis:** Source-code analysis and simulated execution based on the supplied implementation

The purpose of this QA assessment was to evaluate the functional behavior, validation, authentication, authorization, and data-access boundaries of the Artist Management System.

---

## 2. Application Scope

The system provides functionality for managing:

* User accounts
* User roles
* Artist profiles
* Music records
* Authentication
* Artist and manager workflows
* GraphQL queries and mutations

### User Roles

The application currently defines:

* Super Admin
* Artist Manager
* Artist

---

## 3. QA Scope

Testing activities covered:

### Authentication

* Login
* Registration
* Invalid credentials
* Missing authentication
* Invalid authentication tokens
* Protected GraphQL operations

### User Management

* User creation
* User retrieval
* Duplicate email handling
* Role assignment
* Permission restrictions

### Artist Management

* Artist creation
* Artist retrieval
* Artist update
* Artist deletion
* Artist-user association
* Input validation
* Artist ownership

### Music Management

* Music creation
* Music retrieval
* Music update
* Music deletion
* Artist association
* Input validation
* Music ownership

### Authorization

* Role-based access
* Object-level access
* Collection-level access
* Cross-artist access
* Unauthorized mutations
* Privilege boundaries

---

## 4. QA Deliverables

The following QA artifacts were created:

| Artifact                  | Location                                     |
| ------------------------- | -------------------------------------------- |
| QA README                 | `qa/README.md`                               |
| QA Workflow               | `qa/qa-workflow.md`                          |
| Test Plan                 | `qa/test-plan/test-plan.md`                  |
| Authentication Test Cases | `qa/test-cases/authentication.md`            |
| User Test Cases           | `qa/test-cases/user-management.md`           |
| Artist Test Cases         | `qa/test-cases/artist-management.md`         |
| Music Test Cases          | `qa/test-cases/music-management.md`          |
| Authorization Test Cases  | `qa/test-cases/authorization.md`             |
| Test Data                 | `qa/test-data/test-data.md`                  |
| Test Execution Report     | `qa/test-execution/test-execution-report.md` |
| Defect Summary            | `qa/defect-summary/defect-summary.md`        |
| Individual Bug Reports    | `qa/bug-reports/`                            |
| Evidence Guidelines       | `qa/evidence/README.md`                      |

---

## 5. Test Execution

The execution assessment was performed using source-code analysis and simulated test results.

It should not be interpreted as a record of actual browser/Postman runtime execution.

### Execution Categories

| Category            | Result              |
| ------------------- | ------------------- |
| Authentication      | Assessed            |
| User Management     | Assessed            |
| Artist Management   | Assessed            |
| Music Management    | Assessed            |
| Authorization       | Assessed            |
| Validation          | Assessed            |
| Runtime Evidence    | Partially Available |
| Performance Testing | Not Performed       |

Runtime verification remains necessary before treating all simulated results as confirmed production defects.

---

## 6. Environment Observations

During frontend/backend integration testing, the frontend initially attempted to access:

```text
http://localhost:3000/graphql
```

The request returned:

```text
404 Not Found
```

The backend GraphQL endpoint was configured at:

```text
http://localhost:8001/graphql/
```

After configuring the frontend API URL appropriately, the GraphQL request successfully reached the backend.

This was classified as an environment/configuration issue rather than an application defect.

---

## 7. Major Findings

The assessment identified several authorization concerns.

The most important pattern was that some GraphQL resolvers required authentication but did not perform sufficient role or ownership checks.

For example:

```python
@login_required
def resolve_all_artist(self, info, search=None, first=None, skip=0):
```

Authentication confirms that a user is logged in, but it does not by itself establish that the user is authorized to access every Artist record.

Similar concerns were identified in:

```text
allArtist
artistById
allMusic
musicById
```

These areas require explicit authorization rules based on the application's intended access model.

---

## 8. Defect Summary

A total of 12 findings were documented during the assessment.

| Severity | Count |
| -------- | ----: |
| Critical |     0 |
| High     |     4 |
| Medium   |     8 |
| Low      |     0 |

### High-Severity Findings

* Artist can potentially access all Artist records
* Artist can potentially access all Music records
* Artist can potentially access another Artist's profile
* Artist can potentially access another Artist's Music record

### Other Findings

Additional findings covered:

* Duplicate Artist profile assignment
* Negative numeric values
* Future dates of birth
* Empty Artist fields
* Music reassignment
* Empty Music fields
* Weak passwords
* Email validation

Some findings require runtime verification or confirmation of the intended business requirements before being treated as confirmed product defects.

---

## 9. Root-Cause Categories

The findings can broadly be grouped into four categories.

### Authorization

Missing role and ownership checks in GraphQL resolvers.

### Validation

Insufficient application-level validation for user-provided input.

### Data Integrity

Insufficient protection around unique relationships such as the Artist/User relationship.

### Authentication

Password and account-input validation requires additional verification against the project's authentication configuration.

---

## 10. Risk Assessment

The primary risk area is unauthorized access to records belonging to other users.

A role-based application should distinguish between:

```text
Authentication
        ↓
Who is the user?
        ↓
Authorization
        ↓
What is the user allowed to access?
        ↓
Object ownership
        ↓
Which specific records can the user access?
```

Authorization should therefore be validated at both collection and object level where required.

---

## 11. Recommended Retest Scope

After fixes are implemented, QA should prioritize:

1. Artist accessing another Artist profile
2. Artist accessing all Artist records
3. Artist accessing another Artist's Music
4. Artist accessing all Music records
5. Unauthorized Artist mutations
6. Duplicate Artist profile assignment
7. Negative numeric values
8. Future DOB
9. Blank text values
10. Password validation
11. Email validation
12. Music reassignment rules

---

## 12. Regression Testing

Following defect fixes, regression testing should verify that existing functionality remains intact.

### Super Admin

* User management
* Artist management
* Music management
* Access to authorized records

### Artist Manager

* Artist management
* Music management
* Artist user creation
* Role restrictions

### Artist

* Own Artist profile
* Own Music records
* Restrictions against other Artists' records

---

## 13. Evidence

Evidence should be stored under:

```text
qa/evidence/
```

Evidence should include only actual observations such as:

* GraphQL responses
* Browser screenshots
* Network requests
* Error responses
* Test execution output

Simulated results should not be presented as actual screenshots or runtime evidence.

---

## 14. QA Status

**Overall QA Status:** Assessment Completed — Remediation Required

The application contains functional CRUD and authentication flows, but authorization boundaries require additional attention before the system can be considered fully verified.

The identified findings should be resolved and retested according to their severity and business impact.

---

## 15. Testing Limitations

This assessment has the following limitations:

* Some results are based on source-code analysis rather than live execution.
* Full browser testing was not performed.
* Performance/load testing was not performed.
* Some validation behavior depends on Django configuration that was not fully verified.
* Business requirements for certain authorization scenarios require confirmation.
* Simulated findings require runtime verification before final closure.

---

## 16. Conclusion

The QA assessment established a structured testing process covering test planning, test-case design, test data, execution analysis, defect reporting, and retesting.

The primary technical concern identified during the assessment is authorization at the GraphQL resolver level, particularly where authentication is enforced without corresponding role or ownership checks.

The next QA cycle should focus on fixing these access-control issues, validating input constraints, executing the affected test cases against the running application, and performing regression testing after remediation.
