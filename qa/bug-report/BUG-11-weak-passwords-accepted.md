# BUG-011 — Weak Passwords Can Be Accepted During User Registration

**Severity:** Medium
**Priority:** P2
**Status:** Open
**Detection Method:** Code Review
**Component:** GraphQL API — User Management / Authentication
**Affected Operations:** `registerUser`, `createUser`

## Description

The user creation mutations pass the supplied password directly to Django's `create_user()` method without explicitly invoking password validation.

As a result, passwords that would normally be considered weak may be accepted unless password validation is enforced elsewhere in the project.

## Expected Result

The application should enforce an appropriate password policy when creating accounts.

For example, passwords that are too short or otherwise fail the configured password validators should be rejected with a clear validation message.

## Actual Result

`RegisterUser` contains:

```python id="u6m2pa"
user = User.objects.create_user(
    username=email,
    email=email,
    password=password,
    role=RoleChoices.ARTIST,
)
```

`CreateUser` similarly contains:

```python id="r3k8wd"
user = User.objects.create_user(
    username=email,
    email=email,
    password=password,
    role=role_value,
)
```

Neither mutation explicitly calls Django's password validation framework before creating the account.

## Impact

Weak passwords may be accepted, increasing the risk of account compromise through password guessing or credential attacks.

This is particularly relevant because the application uses role-based accounts including:

* Super Admin
* Artist Manager
* Artist

A compromised privileged account could have a greater impact than a compromised Artist account.

## Root Cause

Password creation and password validation are treated as separate concerns.

Using:

```python
User.objects.create_user(...)
```

hashes the password, but password hashing does not by itself mean that the password has passed Django's configured password validators.

## Recommended Fix

Validate the password before creating the user.

For example:

```python id="c8v4qn"
from django.contrib.auth.password_validation import validate_password

validate_password(password)
```

Then create the user only after validation succeeds.

A controlled GraphQL error should be returned when validation fails.

The project's Django `AUTH_PASSWORD_VALIDATORS` should also be reviewed to ensure the intended validators are configured.

## Verification Plan

| Test                                                | Expected Result                                  |
| --------------------------------------------------- | ------------------------------------------------ |
| Strong password                                     | Account created                                  |
| Very short password                                 | Rejected                                         |
| Common password                                     | Rejected if common-password validator is enabled |
| Password based on username/email                    | Rejected if similarity validator is enabled      |
| Password containing only simple repeated characters | Rejected according to configured policy          |
| Valid password through `createUser`                 | Account created                                  |

## Related Test Cases

**AUTH-001 — Valid Registration**

**AUTH-004 — Invalid Registration Data**

**USER-001 — Create User**

**USER-006 — Invalid User Data**

## Evidence Status

This finding was identified through source-code review.

**Runtime reproduction:** Not yet executed.

The final defect classification should be confirmed after checking the project's Django password-validator configuration and testing the GraphQL mutations.
