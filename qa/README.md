# QA — Artist Management System

This directory contains the Quality Assurance documentation and testing artifacts for the Artist Management System.

The QA work covers functional testing, API testing, authentication, authorization, validation, negative testing, regression testing, and code-review-based defect identification.

## QA Scope

The following areas are covered:

* Authentication
* User Management
* Artist Management
* Music Management
* Role-Based Authorization
* GraphQL API
* Input Validation
* Negative Testing
* Regression Testing
* Data Integrity
* Security-Focused Authorization Testing

## QA Documentation

| Artifact                                                           | Description                                                            |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| [Test Plan](./test-plan/test-plan.md)                              | Overall QA strategy, scope, environment, risks, and execution criteria |
| [Authentication Test Cases](./test-cases/authentication.md)        | Login, logout, token, and authentication scenarios                     |
| [Artist Test Cases](./test-cases/artist-management.md)             | Artist CRUD, validation, search, and authorization                     |
| [User Test Cases](./test-cases/user-management.md)                 | User management, roles, validation, and authorization                  |
| [Music Test Cases](./test-cases/music-management.md)               | Music CRUD, ownership, validation, and authorization                   |
| [Authorization Test Cases](./test-cases/authorization.md)          | Role-based and object-level authorization scenarios                    |
| [Test Data](./test-data/test-data.md)                              | Synthetic accounts and test data definitions                           |
| [Test Execution Report](./test-execution/test-execution-report.md) | Execution status and observed results                                  |
| [Bug Reports](./bug-reports/README.md)                             | Defect reporting standards and identified findings                     |
| [Evidence](./evidence/README.md)                                   | Supporting screenshots and API evidence                                |

## Bug Findings

The QA review identified multiple authorization, validation, and data-integrity findings through source-code analysis.

The most significant findings involve:

* Unauthorized access to Artist collections
* Unauthorized access to Music collections
* Unauthorized object-level Artist access
* Unauthorized object-level Music access
* Artist profile relationship integrity
* Missing numeric validation
* Missing date validation
* Missing text-field validation
* Music/Artist relationship validation
* Password validation
* Email validation

See the [Bug Reports](./bug-reports/README.md) directory for the individual findings.

## Testing Approach

Testing follows a risk-based approach.

### Functional Testing

Verifies that application features perform their intended operations.

### Negative Testing

Verifies application behavior when invalid, missing, unexpected, or unauthorized input is supplied.

### Authorization Testing

Tests whether users can access only the resources permitted by their role.

Particular attention is given to:

* Collection-level authorization
* Object-level authorization
* Cross-artist access
* Privilege escalation
* Unauthenticated access

### API Testing

GraphQL queries and mutations are evaluated for:

* Request validation
* Response behavior
* Authentication
* Authorization
* Error handling
* Data integrity

### Code Review

Source-code review is used to identify potential defects that may not yet have been reproduced through runtime testing.

Code-review findings are explicitly distinguished from runtime-confirmed defects.

## Test Environment

The application consists of:

* Django backend
* GraphQL API
* Graphene-Django
* PostgreSQL
* Next.js frontend
* Apollo Client
* JWT authentication

Example local endpoints:

```text
Frontend:
http://localhost:3000

GraphQL API:
http://localhost:8001/graphql/
```

## Test Data

Only synthetic test data should be used for QA execution.

Test accounts are organized by role:

```text
Super Admin
Artist Manager
Artist
```

No real credentials or sensitive personal information should be stored in this repository.

## Evidence Policy

Evidence is collected selectively for important workflows, defects, authorization findings, and API behavior.

Not every test case requires a screenshot.

Evidence represents actual observed behavior and must not be fabricated.

## QA Workflow

```text
Requirements / Code Review
        ↓
Test Planning
        ↓
Test Case Design
        ↓
Test Data Preparation
        ↓
Test Execution
        ↓
Evidence Collection
        ↓
Defect Identification
        ↓
Bug Reporting
        ↓
Retesting
        ↓
Regression Testing
        ↓
Final QA Report
```

## Current QA Status

The project contains:

* A complete QA test plan
* Functional test cases
* Authorization test cases
* Test data definitions
* Test execution documentation
* Bug-reporting standards
* Code-review findings
* Evidence structure

Runtime execution should be used to verify code-review findings before they are reported as confirmed application defects.

## QA Skills Demonstrated

This project demonstrates practical experience with:

* Manual Testing
* Test Case Design
* Test Planning
* Functional Testing
* Negative Testing
* API Testing
* GraphQL Testing
* Authentication Testing
* Authorization Testing
* Role-Based Access Control
* Object-Level Access Control
* Input Validation
* Data Integrity Testing
* Regression Testing
* Defect Reporting
* Source Code Review
* Risk-Based Testing
* Test Documentation
* Git/GitHub QA Workflow
