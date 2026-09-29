# AMS — Artist Management System

A full-stack Artist Management System built with Django (GraphQL) backend and Next.js frontend.

---

## Tech Stack

**Backend**
- Python 3.12
- Django 5.2
- Graphene-Django (GraphQL)
- PostgreSQL 16
- django-graphql-jwt (JWT authentication)
- django-cors-headers
- Gunicorn
- Docker & Docker Compose

**Frontend**
- Next.js 16
- React 19
- TypeScript
- TailwindCSS
- Apollo Client (GraphQL)
- jwt-decode
- shadcn/ui + Radix UI
- Lucide React
- Chart.js

---

## Project Structure

```
prasna/
├── apps/
│   └── users/
│       ├── models/
│       │   ├── user.py        # Custom user model with roles
│       │   ├── artist.py      # Artist model
│       │   └── music.py       # Music model
│       └── schema/
│           ├── user.py        # User GraphQL schema
│           ├── artist.py      # Artist GraphQL schema
│           └── music.py       # Music GraphQL schema
├── core/
│   ├── settings.py
│   ├── schema.py              # Root GraphQL schema
│   ├── jwt.py                 # Custom JWT payload
│   └── urls.py
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Register page
│   │   ├── dashboard/         # Admin dashboard
│   │   │   ├── artists/       # Artist management
│   │   │   ├── music/         # Music management
│   │   │   └── profile/       # Profile page
│   │   └── artist/            # Artist portal
│   ├── components/
│   ├── lib/
│   │   ├── apollo.ts          # Apollo client setup
│   │   └── token.ts           # JWT token service
│   └── services/
│       ├── auth.service.ts
│       ├── artist.service.ts
│       ├── music.service.ts
│       └── user.service.ts
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

---

## Roles & Permissions

| Role | Permissions |
|---|---|
| `super_admin` | Create/manage super admins, artist managers, artists, and music |
| `artist_manager` | Create/manage artists and music only |
| `artist` | Read-only access to own profile and music via Artist Portal |

---

## Getting Started

### Prerequisites
- Docker Desktop
- Node.js 20+
- npm

### Backend Setup (Docker)

1. Clone the repository:
```bash
git clone <repo-url>
cd prasna
```

2. Create a `.env` file in the root:
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=mydb
DB_USER=myuser
DB_PASSWORD=mypassword
DB_HOST=db
DB_PORT=5432
```

3. Build and start the containers:
```bash
docker-compose up --build
```

This will automatically:
- Start PostgreSQL
- Run migrations
- Collect static files
- Start the Django server on `http://localhost:8001`

4. Create the first super admin:
```bash
docker exec -it prasna-web-1 python manage.py shell
```

```python
from apps.users.models.user import User, RoleChoices

u = User.objects.create_superuser(
    email="admin@example.com",
    username="admin@example.com",
    password="your-password"
)
u.role = RoleChoices.SUPER_ADMIN
u.save()
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8001/graphql/
```

4. Start the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`.

---

## GraphQL API

The API is available at `http://localhost:8001/graphql/`.

### Authentication

Obtain a JWT token:
```graphql
mutation {
  tokenAuth(email: "admin@example.com", password: "secret") {
    token
  }
}
```

Use the token in request headers:
```json
{
  "Authorization": "JWT your_token_here"
}
```

### Key Queries

```graphql
# Get all artists (paginated)
query {
  allArtist(first: 10, skip: 0, search: "") {
    totalRows
    rows {
      id
      name
      dob
      gender
      address
      firstReleaseYear
      noOfAlbumsReleased
    }
  }
}

# Get all music (paginated)
query {
  allMusic(first: 10, skip: 0) {
    totalRows
    rows {
      id
      title
      albumName
      genre
      artist {
        id
        name
      }
    }
  }
}

# Get logged-in artist's profile
query {
  myArtistProfile {
    id
    name
    dob
    gender
    address
  }
}

# Get logged-in artist's music
query {
  myMusic(first: 10, skip: 0) {
    totalRows
    rows {
      id
      title
      albumName
      genre
    }
  }
}
```

### Key Mutations

```graphql
# Register a new user (creates ARTIST role)
mutation {
  registerUser(email: "user@example.com", password: "password") {
    message
    user { id email }
  }
}

# Create a user with specific role (requires super_admin or artist_manager)
mutation {
  createUser(email: "manager@example.com", password: "password", role: ARTIST_MANAGER) {
    message
    user { id email role }
  }
}

# Create an artist
mutation {
  createArtist(input: {
    name: "Artist Name"
    dob: "1990-01-01"
    gender: MALE
    address: "Kathmandu, Nepal"
    firstReleaseYear: 2010
    noOfAlbumsReleased: 5
    userId: "1"
  }) {
    artist { id name }
    message
  }
}

# Create music
mutation {
  createMusic(input: {
    artistId: "1"
    title: "Song Title"
    albumName: "Album Name"
    genre: POP
  }) {
    music { id title }
    message
  }
}
```

---

## User Flows

### Admin Flow
1. Super admin logs in at `/login`
2. Creates artist manager accounts via `createUser` mutation
3. Creates artist profiles and links them to user accounts
4. Manages all artists and music from the dashboard

### Artist Manager Flow
1. Logs in at `/login`
2. Creates artist profiles and links them to user accounts
3. Manages artists and music (cannot create other managers or admins)

### Artist Flow
1. Receives credentials from super admin or artist manager
2. Logs in at `/login`
3. Gets redirected to `/artist` — Artist Portal
4. Can view their own profile and music (read-only)

---

## Docker Services

| Service | Description | Port |
|---|---|---|
| `db` | PostgreSQL database | 5432 |
| `pgadmin` | pgAdmin UI | 5051 |
| `migrate` | Runs migrations on startup | — |
| `web` | Django + Gunicorn | 8001 |

---

## Environment Variables

### Backend (`.env`)
| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | Debug mode (`True`/`False`) |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts |
| `DB_NAME` | PostgreSQL database name |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port (default: 5432) |

### Frontend (`.env.local`)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | GraphQL API URL |

---

## Genre Choices

`rock`, `pop`, `jazz`, `classical`, `hip_hop`, `rnb`, `country`, `blues`, `other`

## Gender Choices

`m` (Male), `f` (Female), `o` (Other)
## QA & Testing

This project includes a structured QA process covering functional testing, authentication, authorization, input validation, negative testing, defect reporting, and regression planning.

### QA Coverage

* Functional testing
* GraphQL/API testing
* Authentication testing
* Role-based authorization testing
* Object-level access control testing
* Input validation
* Negative testing
* Boundary-value testing
* Test case design
* Defect reporting
* Regression testing

### QA Documentation

Detailed QA documentation is available in the [`qa/`](./qa/) directory.

```text
qa/
├── test-plan/
│   └── test-plan.md
├── test-cases/
│   ├── authentication.md
│   ├── artist-management.md
│   ├── user-management.md
│   ├── music-management.md
│   └── authorization.md
├── test-data/
│   └── test-data.md
├── test-execution/
│   └── test-execution-report.md
├── defect-summary/
│   └── defect-summary.md
├── bug-reports/
│   ├── README.md
│   └── BUG-001 to BUG-012
├── qa-workflow.md
├── README.md
└── final-report.md
```

### Key QA Findings

The assessment identified authorization and validation concerns, including:

* Insufficient access restrictions for some Artist records
* Potential cross-artist Music access
* Missing object-level authorization checks
* Input validation gaps
* Potential Artist/User relationship integrity issues
* Password and email validation requiring additional verification

### QA Note

The current QA execution report is based on **source-code analysis and simulated execution**. It does not claim that every test case was manually executed against a live environment.

No fabricated runtime evidence or screenshots are included.
