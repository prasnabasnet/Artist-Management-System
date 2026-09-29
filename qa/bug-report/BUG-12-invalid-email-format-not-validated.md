# BUG-012 — Invalid Email Format Is Not Explicitly Validated

**Severity:** Medium
**Priority:** P2
**Status:** Open
**Detection Method:** Code Review
**Component:** GraphQL API — User Management
**Affected Operations:** `registerUser`, `createUser`

## Description

The GraphQL mutations define `email` as a generic `String`, and the mutation logic does not explicitly validate that the supplied value is a valid email address.

The Django User model uses `EmailField`, but the mutation passes the raw GraphQL value directly into `create_user()`.

## Expected Result

The API should reject malformed email addresses before creating an account.

Examples that should be rejected include:

```text
invalid-email
user@
@example.com
user@ 
```

A valid address such as:

```text
artist@example.com
```

should be accepted.

## Actual Result

The GraphQL arguments are defined as:

```python id="f3q7mv"
class Arguments:
    email = graphene.String(required=True)
    password = graphene.String(required=True)
```

The value is then passed directly to:

```python id="n5w8ka"
User.objects.create_user(
    username=email,
    email=email,
    password=password,
    role=RoleChoices.ARTIST,
)
```

The same pattern exists in `CreateUser`.

There is no explicit `validate_email()` call or GraphQL `Email` scalar.

## Impact

Invalid email addresses could potentially reach the persistence layer.

This may cause:

* Invalid account data
* Authentication/account-management problems
* Incorrect email communication
* Inconsistent validation behavior
* Unexpected database validation errors

## Root Cause

The API input layer uses `graphene.String` instead of an email-specific input type or explicit email validation.

The mutation also does not catch validation errors and convert them into a controlled application response.

## Recommended Fix

Use explicit email validation before creating the User.

For example:

```python id="y2r6pc"
from django.core.validators import validate_email

validate_email(email)
```

Alternatively, use an email-specific GraphQL scalar if the project's GraphQL configuration supports one.

The validation should be applied consistently to both `registerUser` and `createUser`.

## Verification Plan

| Test                              | Expected Result                               |
| --------------------------------- | --------------------------------------------- |
| `artist@example.com`              | Accepted                                      |
| `invalid-email`                   | Rejected                                      |
| `user@`                           | Rejected                                      |
| `@example.com`                    | Rejected                                      |
| Empty email                       | Rejected                                      |
| Email with surrounding whitespace | Normalized/rejected according to requirements |
| Duplicate valid email             | Rejected                                      |

## Related Test Cases

**AUTH-001 — Valid Registration**

**AUTH-004 — Invalid Registration Data**

**USER-001 — Create User**

**USER-006 — Invalid User Data**

## Evidence Status

This finding was identified through source-code review.

**Runtime reproduction:** Not yet executed.

The Django model's `EmailField` behavior and current project validation configuration should be verified before classifying this as a confirmed runtime defect.
