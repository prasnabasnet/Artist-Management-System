# Bug Reports

This directory contains defects identified during testing of the Artist Management System.

## Bug Report Format

Each bug should contain:

* Bug ID
* Title
* Date Reported
* Reported By
* Environment
* Severity
* Priority
* Status
* Preconditions
* Steps to Reproduce
* Expected Result
* Actual Result
* Evidence
* Notes

## Severity

| Severity | Description                                                 |
| -------- | ----------------------------------------------------------- |
| Critical | System is unusable or a critical security/data issue exists |
| High     | Major functionality is broken                               |
| Medium   | Functionality is partially affected                         |
| Low      | Minor functional or UI issue                                |

## Priority

| Priority | Description               |
| -------- | ------------------------- |
| P1       | Needs immediate attention |
| P2       | Should be fixed soon      |
| P3       | Can be addressed later    |

## Bug Status

```text
Open
↓
In Progress
↓
Fixed
↓
Retest
↓
Closed
```

If the issue is not fixed during retesting:

```text
Retest
↓
Reopened
```

## Example

### BUG-001 — Example Bug

**Date Reported:** YYYY-MM-DD
**Reported By:** QA
**Environment:** Local Development
**Severity:** Medium
**Priority:** P2
**Status:** Open

**Preconditions:**

* User is logged in.
* At least one artist exists.

**Steps to Reproduce:**

1. Open the artist management page.
2. Open an existing artist.
3. Edit the artist name.
4. Save the changes.

**Expected Result:**

The artist name should be updated successfully.

**Actual Result:**

Describe what actually happened.

**Evidence:**

Add screenshots, API responses, logs, or other relevant evidence.

**Notes:**

Add any additional information that may help reproduce or investigate the issue.
