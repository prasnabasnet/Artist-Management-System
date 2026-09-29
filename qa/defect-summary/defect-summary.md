# Defect Summary Report

## 1. Overview

**Project:** Artist Management System
**Testing Type:** Functional, API, Authorization, Validation, Negative Testing
**Execution Basis:** Simulated execution based on source-code analysis
**Defect Status:** Open / Under Investigation

This report summarizes the defects identified during the QA assessment of the Artist Management System.

---

## 2. Defect Summary

| Bug ID  | Title                                                         | Severity | Priority | Status | Area           |
| ------- | ------------------------------------------------------------- | -------- | -------- | ------ | -------------- |
| BUG-001 | Artist Can Access All Artist Records                          | High     | P1       | Open   | Authorization  |
| BUG-002 | Artist Can Access All Music Records                           | High     | P1       | Open   | Authorization  |
| BUG-003 | Artist Can Access Any Artist Profile                          | High     | P1       | Open   | Authorization  |
| BUG-004 | Artist Can Access Any Music Record                            | High     | P1       | Open   | Authorization  |
| BUG-005 | Duplicate Artist Profile Assignment May Cause Integrity Error | Medium   | P2       | Open   | Data Integrity |
| BUG-006 | Negative Artist Values Are Not Properly Validated             | Medium   | P2       | Open   | Validation     |
| BUG-007 | Future Date of Birth Is Accepted                              | Medium   | P2       | Open   | Validation     |
| BUG-008 | Empty Artist Fields Are Not Properly Validated                | Medium   | P2       | Open   | Validation     |
| BUG-009 | Music Can Be Reassigned to Another Artist                     | Medium   | P2       | Open   | Authorization  |
| BUG-010 | Empty Music Fields Are Not Properly Validated                 | Medium   | P2       | Open   | Validation     |
| BUG-011 | Weak Passwords May Be Accepted                                | Medium   | P2       | Open   | Authentication |
| BUG-012 | Invalid Email Format Validation Requires Verification         | Medium   | P2       | Open   | Validation     |

---

## 3. Severity Distribution

| Severity | Count |
| -------- | ----: |
| Critical |     0 |
| High     |     4 |
| Medium   |     8 |
| Low      |     0 |

**Total:** 12 findings

---

## 4. Defects by Testing Area

| Testing Area   | Findings |
| -------------- | -------: |
| Authorization  |        5 |
| Validation     |        5 |
| Authentication |        1 |
| Data Integrity |        1 |

Authorization represents the largest group of identified findings.

---

## 5. High-Priority Findings

### BUG-001 — Artist Can Access All Artist Records

**Risk:** An Artist may access Artist records outside their own profile.

**Affected operation:**

```text
allArtist
```

**Primary concern:** Missing role/ownership authorization.

---

### BUG-002 — Artist Can Access All Music Records

**Risk:** An Artist may access Music records belonging to other Artists.

**Affected operation:**

```text
allMusic
```

**Primary concern:** Collection-level authorization is missing.

---

### BUG-003 — Artist Can Access Any Artist Profile

**Risk:** An Artist may request another Artist's profile using its ID.

**Affected operation:**

```text
artistById
```

**Primary concern:** Object-level authorization is missing.

---

### BUG-004 — Artist Can Access Any Music Record

**Risk:** An Artist may request another Artist's Music record using its ID.

**Affected operation:**

```text
musicById
```

**Primary concern:** Object-level authorization is missing.

---

## 6. Common Root Cause

Several findings have the same underlying pattern:

```python
@login_required
```

is applied to a resolver, but authentication alone does not determine whether the authenticated user is authorized to access the requested resource.

For example:

```python
@login_required
def resolve_all_artist(self, info, search=None, first=None, skip=0):
```

The resolver verifies that the user is authenticated, but does not verify the user's role.

Similarly:

```python
@login_required
def resolve_artist_by_id(self, info, id):
```

checks authentication but does not check whether the requesting Artist owns the requested profile.

This creates a distinction between:

**Authentication**

> "Who are you?"

and

**Authorization**

> "Are you allowed to access this resource?"

---

## 7. Recommended Remediation Areas

### Authorization

Introduce explicit role and ownership checks for:

```text
allArtist
artistById
allMusic
musicById
```

The expected access model should be documented before implementation.

### Validation

Add application-level validation for:

* Negative numeric values
* Future dates
* Blank/whitespace-only strings
* Password strength
* Email format
* Duplicate profile relationships

### Data Integrity

Validate the User ↔ Artist one-to-one relationship before creating or assigning an Artist profile.

### Business Rules

Clarify whether Music reassignment between Artists is an authorized management operation.

---

## 8. Retest Plan

After fixes are implemented, the following areas should be retested:

1. Artist accessing another Artist profile
2. Artist accessing all Artist records
3. Artist accessing another Artist's Music
4. Artist accessing all Music records
5. Artist attempting unauthorized mutations
6. Duplicate Artist profile assignment
7. Invalid numeric values
8. Future DOB
9. Blank text fields
10. Password validation
11. Email validation
12. Music reassignment

Regression testing should then cover the normal Super Admin, Artist Manager, and Artist workflows.

---

## 9. Current Defect Status

| Status          | Count |
| --------------- | ----: |
| Open            |    12 |
| Fixed           |     0 |
| Retest Required |     0 |
| Closed          |     0 |

No defects should be marked **Fixed**, **Verified**, or **Closed** until the corresponding implementation change has been tested.

---

## 10. QA Conclusion

The assessment identified multiple authorization and input-validation risks.

The highest-impact area is access control between Artist accounts because several GraphQL queries authenticate users without sufficiently restricting which records those users can access.

The next QA cycle should focus on remediation, retesting, and regression verification of these authorization boundaries.
