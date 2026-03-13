# SkillSwap Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                             │
│                   http://localhost:3000                             │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Register    │  │    Login     │  │   Dashboard  │             │
│  │    Page      │  │     Page     │  │     Page     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Skills List │  │ Create Skill │  │   My Requests│             │
│  │     Page     │  │    Page      │  │     Page     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                     │
│         │                               │                          │
│         └───────────────────────────────┘                          │
│                      │                                              │
│            API Service (api.js)                                    │
│                      │                                              │
│         JWT Token: localStorage                                    │
│                                                                     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                 HTTP Requests/Responses
                      (fetch API)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Backend (Flask)                                  │
│               http://localhost:5000/api                            │
│                                                                     │
│  ┌──────────────────────────────────────────────────────┐         │
│  │    App Factory Pattern (app/__init__.py)            │         │
│  └──────────────────────────────────────────────────────┘         │
│                                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌────────────┐    │
│  │   Auth    │  │   Users   │  │  Skills   │  │ Requests   │    │
│  │ Blueprint │  │ Blueprint │  │ Blueprint │  │ Blueprint  │    │
│  │ (routes)  │  │ (routes)  │  │ (routes)  │  │ (routes)   │    │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └──────┬─────┘    │
│        │              │              │               │            │
│        └──────────────┬──────────────┴───────────────┘            │
│                       │                                             │
│          ┌────────────▼──────────────┐                            │
│          │   Models (models.py)      │                            │
│          │ ┌──────────────────────┐  │                            │
│          │ │ User                 │  │                            │
│          │ │ Skill                │  │                            │
│          │ │ SkillRequest         │  │                            │
│          │ └──────────────────────┘  │                            │
│          └────────────┬───────────────┘                            │
│                       │                                             │
│        ┌──────────────▼──────────────┐                            │
│        │   SQLAlchemy ORM            │                            │
│        │   (extensions.py)           │                            │
│        └──────────────┬───────────────┘                            │
│                       │                                             │
└───────────────────────┼────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SQLite Database                                   │
│              (backend/skillswap.db)                                  │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────┐                  │
│  │  users   │  │  skills  │  │ skill_requests  │                  │
│  │ table    │  │  table   │  │   table         │                  │
│  └──────────┘  └──────────┘  └─────────────────┘                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## API Routes Structure

```
/api
├── /auth
│   ├── POST /register          ─► Create new user
│   └── POST /login             ─► Get JWT token
│
├── /users
│   ├── GET /profile            ─► Get current user (protected)
│   └── GET /list               ─► List all users (admin only)
│
├── /skills
│   ├── POST /create            ─► Create skill (protected)
│   ├── GET /list               ─► List all skills
│   ├── PUT /<id>/update        ─► Update skill (owner/admin)
│   └── DELETE /<id>/delete     ─► Delete skill (owner/admin)
│
└── /requests
    ├── POST /request-skill     ─► Request skill (protected)
    ├── GET /my-requests        ─► Get my requests (protected)
    ├── GET /received-requests  ─► Get received requests (protected)
    ├── PUT /<id>/accept        ─► Accept request (protected)
    └── PUT /<id>/reject        ─► Reject request (protected)
```

---

## Database Schema

```
users (Table)
├── id (INTEGER, PRIMARY KEY)
├── name (STRING)
├── email (STRING, UNIQUE)
├── password_hash (STRING)
├── role (STRING) ─► 'admin' or 'student'
└── created_at (DATETIME)

skills (Table)
├── id (INTEGER, PRIMARY KEY)
├── title (STRING)
├── description (TEXT)
├── created_by (INTEGER, FOREIGN KEY → users.id)
└── created_at (DATETIME)

skill_requests (Table)
├── id (INTEGER, PRIMARY KEY)
├── skill_id (INTEGER, FOREIGN KEY → skills.id)
├── requester_id (INTEGER, FOREIGN KEY → users.id)
├── status (STRING) ─► 'pending', 'accepted', 'rejected'
├── created_at (DATETIME)
└── updated_at (DATETIME)
```

---

## Authentication Flow

```
1. User Registration
   └─► POST /auth/register
       └─► Validate input
       └─► Hash password
       └─► Store user in DB
       └─► Return: user object

2. User Login
   └─► POST /auth/login
       └─► Find user by email
       └─► Verify password
       └─► Generate JWT token
       └─► Return: token + user object

3. Protected Request
   └─► Include Authorization header: "Bearer <token>"
       └─► Flask verifies token signature
       └─► Extract user ID from token
       └─► Execute route handler
       └─► Return response
```

## Authorization Flow

```
Request to Protected Route
├─► Check JWT token validity
├─► Extract user ID from token
├─► Get user from database
├─► Check role
│   ├─► If admin ─► Allow all operations
│   └─► If student ─► Check ownership/permissions
├─► Execute operation or return 403 Forbidden
└─► Return response
```

---

## Token Management in React

```
localStorage
├── token (JWT access token)
│   └── Format: "eyJ0eXAiOiJKV1QiLCJhbGc..."
│   └─► Expires: 24 hours
│   └─► Used: In Authorization header
│
└── user (Current user data)
    └── Format: JSON {id, name, email, role}
    └─► Used: Display user info

API Service (api.js)
└── Automatically adds token to requests:
    └── Authorization: `Bearer ${token}`
```

---

## Communication Flow Example: Create Skill

```
React (SkillsList.js)
    │
    ├─► User clicks "Create Skill"
    │
    ├─► skillsAPI.createSkill(title, description)
    │
    ├─► POST http://localhost:5000/api/skills/create
    │   ├── Headers: Authorization: Bearer <token>
    │   ├── Body: {title: "Python", description: "..."}
    │
    ▼
Flask (skill/routes.py)
    │
    ├─► Receive POST request
    │
    ├─► @jwt_required() ─► Verify token
    │
    ├─► Extract user_id from token
    │
    ├─► Create Skill object
    │   └── created_by = user_id
    │
    ├─► Save to database (SQLite)
    │
    ├─► Return JSON response
    │   └── {message: "Skill created", skill: {...}}
    │
    ▼
React
    │
    ├─► Receive JSON response
    │
    ├─► Update state
    │
    └─► Re-render UI with new skill
```

---

## Configuration Impact

**config.py Settings:**
- `SQLALCHEMY_DATABASE_URI` ─► Where database is stored (SQLite file)
- `JWT_SECRET_KEY` ─► How tokens are signed/verified
- `JWT_ACCESS_TOKEN_EXPIRES` ─► Token lifetime (24 hours)
- `DEBUG` ─► Auto-reload on code changes

**Environment Variables (.env):**
- `FLASK_ENV` ─► Which config to use (development/production)
- `JWT_SECRET_KEY` ─► Secret key for tokens

---

**This architecture ensures clean separation of concerns, secure authentication, and scalable design.**
