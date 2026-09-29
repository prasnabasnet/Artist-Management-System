# Bug Reports

This directory contains defects and potential defects identified during the QA review of the Artist Management System.

Findings were identified through a combination of source-code review and runtime observations. Each report clearly identifies the detection method and whether runtime reproduction has been performed.

## Bug Report Index

| ID                                                                   | Area           | Severity | Priority | Detection   |
| -------------------------------------------------------------------- | -------------- | -------- | -------- | ----------- |
| [BUG-001](./BUG-001-artist-can-access-all-artists.md)                | Authorization  | High     | P1       | Code Review |
| [BUG-002](./BUG-002-artist-can-access-all-music.md)                  | Authorization  | High     | P1       | Code Review |
| [BUG-003](./BUG-003-artist-can-access-any-artist-profile.md)         | Authorization  | High     | P1       | Code Review |
| [BUG-004](./BUG-004-artist-can-access-any-music-record.md)           | Authorization  | High     | P1       | Code Review |
| [BUG-005](./BUG-005-duplicate-artist-profile-causes-server-error.md) | Data Integrity | Medium   | P2       | Code Review |
| [BUG-006](./BUG-006-negative-artist-values-not-validated.md)         | Validation     | Medium   | P2       | Code Review |
| [BUG-007](./BUG-007-future-date-of-birth-accepted.md)                | Validation     | Medium   | P2       | Code Review |
| [BUG-008](./BUG-008-empty-artist-fields-accepted.md)                 | Validation     | Medium   | P2       | Code Review |
| [BUG-009](./BUG-009-music-can-be-reassigned-to-any-artist.md)        | Data Integrity | Medium   | P2       | Code Review |
| [BUG-010](./BUG-010-empty-music-fields-accepted.md)                  | Validation     | Medium   | P2       | Code Review |
| [BUG-011](./BUG-011-weak-passwords-accepted.md)                      | Authentication | Medium   | P2       | Code Review |
| [BUG-012](./BUG-012-invalid-email-format-not-validated.md)           | Validation     | Medium   | P2       | Code Review |

## Severity Definitions

### Critical

A defect that can cause severe security impact, major data loss, system-wide failure, or complete loss of a critical business function.

### High

A defect that significantly affects security, authorization, core functionality, or important user data.

### Medium

A defect that affects data quality, validation, usability, or a significant but non-critical workflow.

### Low

A defect with limited functional or usability impact.

## Priority Definitions

### P1 — High

Requires prompt attention because the issue can significantly affect security, core functionality, or important data.

### P2 — Medium

Should be addressed during normal development and QA cycles.

### P3 — Low

Can be addressed when higher-priority work is complete.

## Detection Methods

### Code Review

A potential defect identified by examining application source code.

Code-review findings are not represented as runtime-confirmed defects unless they have been reproduced in the running application.

### Runtime Testing

A defect observed while executing a test against the running application.

Runtime defects should include reproducible steps and actual results.

## Defect Lifecycle

```text
Identified
    ↓
Triaged
    ↓
Open
    ↓
In Progress
    ↓
Fixed
    ↓
Retest
    ↓
Verified / Reopened
    ↓
Closed
```

## Reporting Standard

Each bug report should contain:

* Bug ID
* Title
* Severity
* Priority
* Status
* Detection method
* Component
* Affected operation
* Description
* Expected result
* Actual result
* Impact
* Root cause
* Recommended fix
* Verification plan
* Related test cases
* Evidence status

## Important QA Principle

A code-review finding should not be presented as a runtime-confirmed defect without executing the relevant test.

Similarly, an environment or configuration problem should not automatically be reported as an application defect.

This distinction keeps the QA results traceable and credible.
