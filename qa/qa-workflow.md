# QA Workflow

## 1. Understand the Application

Review the application's:

* Requirements
* User roles
* Features
* API structure
* Database relationships
* Authentication flow
* Authorization rules

For this project, the primary functional areas are:

* Authentication
* User Management
* Artist Management
* Music Management
* Authorization

## 2. Identify Risks

Review areas where defects could have a significant impact.

Priority is given to:

* Authentication
* Authorization
* Cross-user data access
* Data integrity
* Input validation
* Core CRUD operations

## 3. Create the Test Plan

Define:

* Testing scope
* Testing objectives
* Environment
* Test data
* Entry criteria
* Exit criteria
* Risks
* Defect management process

See:

`test-plan/test-plan.md`

## 4. Design Test Cases

Create positive, negative, boundary, authorization, and regression scenarios.

Test cases are organized by feature:

```text
test-cases/
├── authentication.md
├── authorization.md
├── artist-management.md
├── user-management.md
└── music-management.md
```

## 5. Prepare Test Data

Use synthetic accounts and data representing the application's supported roles.

Example:

```text
Super Admin
Artist Manager
Artist A
Artist B
```

Never store real credentials or sensitive personal information in the repository.

## 6. Execute Tests

Execute selected test cases against the running application.

Record:

* Test ID
* Actual result
* Expected result
* Status
* Evidence
* Defect ID when applicable

Possible statuses:

```text
PASS
FAIL
BLOCKED
NOT EXECUTED
```

## 7. Collect Evidence

Collect evidence when it provides useful verification.

Examples:

* GraphQL requests/responses
* Browser screenshots
* Authorization errors
* Validation errors
* Successful critical workflows
* Defect reproduction

Evidence should represent actual observed behavior.

## 8. Report Defects

When a test fails or a valid defect is identified, create a bug report containing:

* Reproduction steps
* Expected result
* Actual result
* Severity
* Priority
* Environment
* Evidence
* Related test case

For source-code findings, explicitly identify them as **Code Review** findings until runtime verification is completed.

## 9. Retest

After a defect is fixed:

1. Reproduce the original scenario.
2. Verify the expected behavior.
3. Confirm the defect no longer occurs.
4. Update the defect status.

## 10. Regression Testing

Run related test cases after fixes to ensure existing functionality has not been negatively affected.

Particular attention should be given to changes involving:

* Authentication
* Authorization
* User roles
* Artist relationships
* Music relationships
* Shared GraphQL resolvers

## 11. Final Reporting

At the end of the testing cycle, summarize:

* Tests executed
* Passed tests
* Failed tests
* Blocked tests
* Open defects
* Verified fixes
* Remaining risks
* Testing limitations

## QA Principle

The purpose of this workflow is not to maximize the number of bugs reported.

The goal is to provide reliable information about:

> What was tested, what was observed, what remains uncertain, and what risks require attention.
