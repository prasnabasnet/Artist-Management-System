# AMS QA Documentation

## 1. Application Overview
Artist Management System (AMS) is a web application used to manage artists, their user accounts, and their music. The system has three main types of users: - Super Admin - Artist Manager - Artist The application provides functionality for: - User registration and authentication - User and role management - Artist profile management - Music management - Artist-to-user relationships - Artist-to-music relationships The backend is built with Django and exposes functionality through a GraphQL API. JWT is used for authentication. The frontend is built with Next.js and communicates with the backend through GraphQL. The main data entities in the system are: - User - Artist - Music The relationship between the main entities is: User → Artist → Music A User can be linked to one Artist profile, while an Artist can have multiple Music records.

```md
## 2. User Roles

The AMS application has three user roles:

- Super Admin
- Artist Manager
- Artist

### 2.1 Super Admin

The Super Admin is a privileged user who can:

- Log in to the application.
- Create users with different roles.
- View Artist users.
- Create Artist profiles.
- Update Artist profiles.
- Delete Artist profiles.
- Create Music records.
- Update Music records.
- Delete Music records.

The Super Admin has the highest level of access among the three application roles.

### 2.2 Artist Manager

The Artist Manager can:

- Log in to the application.
- Create Artist users.
- View Artist users.
- Create Artist profiles.
- Update Artist profiles.
- Delete Artist profiles.
- Create Music records.
- Update Music records.
- Delete Music records.

An Artist Manager cannot create users with roles other than Artist.

### 2.3 Artist

The Artist has restricted access compared with the Super Admin and Artist Manager.

An Artist can:

- Log in to the application.
- Access their own Artist profile.
- Access their own Music records.

An Artist cannot:

- Create Artist profiles.
- Update Artist profiles.
- Delete Artist profiles.
- Create Music records.
- Update Music records.
- Delete Music records.
- Create privileged users.

The application also provides general Artist and Music queries to authenticated users. Whether Artists should be allowed to access all Artist or Music records is a business rule that should be verified during QA testing.
```md


```md
## 3. Application Features

The AMS application provides the following main features:

### 3.1 Authentication

The authentication system allows users to securely access the application.

Users can:

- Register an Artist account.
- Log in using their email and password.
- Receive a JWT token after successful login.
- Use the JWT token to access authenticated GraphQL operations.
- Verify an existing JWT token.
- Refresh an expired JWT token.
- Log out of the application.

Authentication is required to access protected application features.

### 3.2 User Management

User management allows privileged users to create and view Artist users.

The system supports:

- Creating users with different roles.
- Creating Artist users.
- Viewing Artist users.
- Assigning a role to a newly created user.
- Preventing unauthorized users from creating users.
- Preventing an Artist Manager from creating privileged roles.
- Preventing duplicate email addresses.

The available user roles are:

- Super Admin
- Artist Manager
- Artist

### 3.3 Artist Management

Artist management allows authorized users to manage Artist profiles.

The system supports:

- Creating Artist profiles.
- Viewing Artist profiles.
- Searching Artists by name.
- Viewing an Artist by ID.
- Updating Artist profiles.
- Deleting Artist profiles.
- Linking an Artist profile to an Artist user.
- Viewing an Artist's profile as the associated Artist user.
- Pagination when retrieving multiple Artists.

Artist profiles contain information such as:

- Name
- Date of birth
- Gender
- Address
- First release year
- Number of albums released
- Active/inactive status
- Created date
- Updated date

Artist deletion is implemented as a soft delete. Instead of permanently removing the record from the database, the system marks the Artist as inactive.

### 3.4 Music Management

Music management allows authorized users to manage music records associated with Artists.

The system supports:

- Creating Music records.
- Viewing Music records.
- Searching Music records.
- Viewing Music by ID.
- Updating Music records.
- Deleting Music records.
- Viewing an Artist's own Music records.
- Associating Music with an Artist.
- Pagination when retrieving multiple Music records.

Music records contain information such as:

- Title
- Album name
- Genre
- Artist
- Active/inactive status
- Created date
- Updated date

Music deletion is implemented as a soft delete. Instead of permanently removing the record from the database, the system marks the Music record as inactive.

### 3.5 Authorization

Authorization controls which actions each user role is allowed to perform.

The system must ensure that:

- Only authenticated users can access protected operations.
- Super Admins can perform privileged user-management operations.
- Artist Managers can create Artist users but cannot create privileged roles.
- Only Super Admins and Artist Managers can manage Artist profiles.
- Only Super Admins and Artist Managers can manage Music records.
- Artists cannot perform management operations.
- Artists can access their own Artist profile and Music records.

### 3.6 Search and Pagination

The application provides search and pagination for Artist and Music records.

Users can:

- Search Artists by name.
- Search Music by title.
- Search Music by album name.
- Search Music by Artist name.
- Search Music by genre.
- Retrieve records using pagination parameters.

### 3.7 Artist and Music Relationships

The application maintains relationships between users, Artists, and Music.

The relationships are:

- A User can be associated with one Artist profile.
- An Artist can have multiple Music records.
- Each Music record belongs to one Artist.

The system must ensure that Music records are associated with valid and active Artists.
```


```md
## 4. Business Rules

Business rules define the expected behavior and restrictions of the AMS application.

### 4.1 Authentication Rules

- Users must be authenticated before accessing protected application features.
- Users must provide a valid email and password to log in.
- Each user must have a unique email address.
- A JWT token is issued after successful authentication.
- Invalid credentials must not allow a user to access protected operations.

### 4.2 User Management Rules

- A user can have one of the following roles:
  - Super Admin
  - Artist Manager
  - Artist
- A Super Admin can create users with any available role.
- An Artist Manager can only create users with the Artist role.
- An Artist cannot create users.
- An Artist cannot create privileged users.
- A user cannot be created with an email address that already exists.

### 4.3 Artist Management Rules

- Only authenticated users can access Artist operations.
- Only Super Admins and Artist Managers can create Artist profiles.
- Only Super Admins and Artist Managers can update Artist profiles.
- Only Super Admins and Artist Managers can delete Artist profiles.
- An Artist profile can optionally be associated with an Artist user.
- An Artist profile can only be associated with a user whose role is Artist.
- A user can be associated with only one Artist profile.
- Only active Artist profiles should be returned by active Artist queries.
- Deleting an Artist is a soft delete operation.
- A soft-deleted Artist remains in the database but is marked as inactive.

### 4.4 Music Management Rules

- Only authenticated users can access Music operations.
- Only Super Admins and Artist Managers can create Music records.
- Only Super Admins and Artist Managers can update Music records.
- Only Super Admins and Artist Managers can delete Music records.
- Every Music record must belong to an Artist.
- Music can only be associated with an active Artist.
- Only active Music records should be returned by active Music queries.
- Deleting Music is a soft delete operation.
- A soft-deleted Music record remains in the database but is marked as inactive.

### 4.5 Artist-Specific Access Rules

- An Artist can access their own Artist profile.
- An Artist can access their own Music records.
- An Artist cannot manage other Artist profiles.
- An Artist cannot create, update, or delete Music records.

The application also provides general Artist and Music queries to authenticated users. Whether an Artist should be able to view all active Artists and Music records, or only their own records, must be confirmed as a business requirement.

### 4.6 Search Rules

- Artist search is performed using the Artist name.
- Music search can use:
  - Music title
  - Album name
  - Artist name
  - Genre
- Search should return only active records.
- Search should support partial text matching.

### 4.7 Pagination Rules

- Artist and Music listing queries support pagination.
- The `first` parameter controls the number of records returned.
- The `skip` parameter controls the number of records skipped.
- The total number of matching records should be available in paginated responses.

### 4.8 Data Relationship Rules

- A User can have at most one Artist profile.
- An Artist can have multiple Music records.
- Each Music record belongs to one Artist.
- Deleting an Artist through the application should not permanently remove the database record because Artist deletion uses soft deletion.
- Music associated with an inactive Artist should not be created through the application.
```
````md id="7xq2kp"
## 5. Data Relationships

The AMS application contains three main data entities:

- User
- Artist
- Music

These entities are related to each other to represent users, artist profiles, and music records.

### 5.1 User and Artist Relationship

A User can be associated with one Artist profile.

The relationship is:

```text
User 1 ───── 1 Artist
````

The Artist profile contains a reference to the User.

Rules:

* An Artist profile can optionally be linked to a User.
* Only a User with the Artist role can be linked to an Artist profile.
* A User can be linked to at most one Artist profile.
* An Artist profile can exist without being linked to a User.

### 5.2 Artist and Music Relationship

An Artist can have multiple Music records.

The relationship is:

```text
Artist 1 ───── * Music
```

Rules:

* Each Music record must belong to an Artist.
* An Artist can have zero or more Music records.
* A Music record cannot belong to multiple Artists.
* Music can only be created for an active Artist.

### 5.3 Overall Data Relationship

The overall relationship between the main entities is:

```text
User
  │
  │ 1 : 1
  ▼
Artist
  │
  │ 1 : Many
  ▼
Music
```

Example:

```text
User
└── Artist Profile: "John Doe"
      ├── Music: "Song A"
      ├── Music: "Song B"
      └── Music: "Song C"
```

### 5.4 Soft Delete Relationships

Artist and Music records use soft deletion.

When an Artist is deleted:

```text
Artist
is_active = True
      ↓
   Delete
      ↓
is_active = False
```

The Artist record remains in the database but is treated as inactive by the application.

Similarly, when Music is deleted:

```text
Music
is_active = True
      ↓
   Delete
      ↓
is_active = False
```

The Music record remains in the database but should no longer appear in active Music queries.

### 5.5 Relationship Validation

The following relationship rules should be verified during QA testing:

* An Artist can be linked only to an Artist-role User.
* A User cannot be linked to multiple Artist profiles.
* Music must have a valid Artist.
* Music cannot be created for an inactive Artist.
* Active queries should not return soft-deleted Artists.
* Active queries should not return soft-deleted Music records.
* An Artist should only be able to access their own Artist profile and Music records where the application's intended authorization rules require it.

```


```md id="q7m4kx"
## 6. QA Scope

The QA process for the Artist Management System will focus on verifying that the application's features work according to the defined requirements and business rules.

### 6.1 Functional Testing

Functional testing will verify that application features perform their intended operations.

The following areas will be tested:

- User registration
- User login
- JWT authentication
- User creation
- Artist user management
- Artist creation
- Artist viewing
- Artist updating
- Artist deletion
- Music creation
- Music viewing
- Music updating
- Music deletion
- Artist-specific profile access
- Artist-specific Music access
- Search
- Pagination
- Soft deletion

### 6.2 Authorization Testing

Authorization testing will verify that users can only perform actions allowed by their roles.

The following roles will be tested:

- Super Admin
- Artist Manager
- Artist

Testing will verify:

- Allowed operations for each role.
- Restricted operations for each role.
- Unauthorized access to protected operations.
- Artist Manager restrictions on privileged user creation.
- Artist restrictions on Artist and Music management.
- Access to Artist-specific data.

### 6.3 API and GraphQL Testing

The backend GraphQL API will be tested independently from the frontend.

Testing will cover:

- GraphQL queries.
- GraphQL mutations.
- Request parameters.
- Required fields.
- Invalid input.
- Authentication requirements.
- Authorization requirements.
- Error responses.
- Response data.
- Response structure.
- Pagination.
- Search behavior.

### 6.4 Database Testing

Database-related behavior will be verified to ensure that data is correctly created, updated, related, and deactivated.

Testing will include:

- User records.
- Artist records.
- Music records.
- User-to-Artist relationships.
- Artist-to-Music relationships.
- Unique email constraints.
- One-to-one Artist/User relationship.
- Artist/Music foreign-key relationship.
- Active and inactive records.
- Soft deletion behavior.

### 6.5 Negative Testing

Negative testing will verify how the application behaves when invalid or unauthorized actions are attempted.

Examples include:

- Invalid login credentials.
- Duplicate email addresses.
- Missing required fields.
- Invalid Artist IDs.
- Invalid Music IDs.
- Invalid User IDs.
- Creating Music for an inactive Artist.
- Linking an Artist profile to a non-Artist user.
- Unauthorized management operations.
- Accessing protected operations without authentication.
- Updating or deleting inactive records.

### 6.6 UI Testing

The frontend will be tested to verify that users can interact with the application correctly.

Testing will cover:

- Login page.
- Registration page.
- Dashboard.
- Artist pages.
- Music pages.
- Artist creation and editing forms.
- Music creation and editing forms.
- Profile pages.
- Navigation.
- Form validation.
- Error messages.
- Success messages.
- Logout behavior.

### 6.7 Regression Testing

Regression testing will be performed after changes are made to the application.

The purpose is to verify that:

- Existing functionality still works after changes.
- A new feature does not break existing functionality.
- Bug fixes do not introduce new defects.

### 6.8 Automation Scope

After the manual testing process is established, selected test cases will be automated.

The planned automation areas are:

- API testing using Python and Pytest.
- UI testing using Playwright with Python.
- Automated authentication testing.
- Automated CRUD testing.
- Automated authorization testing.
- Automated regression testing.

Automation will focus on repeatable and important test cases rather than replacing all manual testing.

### 6.9 QA Deliverables

The QA project will produce the following deliverables:

- Requirements documentation.
- Test plan.
- Test cases.
- Test execution results.
- Bug reports.
- API test collection.
- API automation tests.
- UI automation tests.
- Test summary/report.
```
```md
## 7. Out of Scope

The following areas are outside the scope of the current AMS QA project.

### 7.1 Performance and Load Testing

The current QA project will not perform:

- Load testing.
- Stress testing.
- Scalability testing.
- High-concurrency testing.
- Performance benchmarking.

These tests may be considered separately in the future.

### 7.2 Security Penetration Testing

Basic authentication and authorization behavior will be tested, but full security testing is outside the current scope.

This includes:

- Penetration testing.
- Vulnerability scanning.
- Advanced API security testing.
- Security exploitation testing.
- Infrastructure security testing.

### 7.3 Production Infrastructure Testing

The QA project will focus on the application rather than production infrastructure.

The following are outside the current scope:

- Production server testing.
- Cloud infrastructure testing.
- Network infrastructure testing.
- Production deployment validation.
- Server monitoring.

### 7.4 Mobile Application Testing

The AMS application is currently tested as a web application.

Native Android and iOS application testing is outside the scope.

### 7.5 Browser Compatibility Testing

Testing will initially focus on the primary browser used during development and QA.

Extensive cross-browser testing across multiple browsers and browser versions is outside the current scope.

### 7.6 Third-Party Services

Testing external third-party services that are not part of the AMS application's core functionality is outside the current scope.

### 7.7 Accessibility Testing

A full accessibility audit is outside the current QA scope.

Basic usability issues may still be reported when they directly affect normal application functionality.
```

