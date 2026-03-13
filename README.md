# SkillSwap - Full Stack Application

SkillSwap is a full-stack web application that allows users to share and request skills. Built with Flask backend and React frontend using clean architecture principles.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Database Configuration](#database-configuration)
- [JWT Authentication](#jwt-authentication)
- [Running Migrations](#running-migrations)
- [API Documentation](#api-documentation)
- [Testing with Postman](#testing-with-postman)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Backend
- ✅ Clean Architecture with App Factory Pattern
- ✅ Flask Blueprints for modular structure
- ✅ SQLAlchemy ORM with SQLite
- ✅ JWT Authentication with flask-jwt-extended
- ✅ Role-based Authorization (Admin & Student)
- ✅ Comprehensive error handling and validation
- ✅ Database migrations with Flask-Migrate

### Frontend
- ✅ React 18 with React Router
- ✅ JWT token storage in localStorage
- ✅ Clean UI components
- ✅ Responsive design
- ✅ Error handling and loading states

### Models
- **User**: id, name, email, password, role (admin/student)
- **Skill**: id, title, description, created_by (user_id)
- **SkillRequest**: id, skill_id, requester_id, status (pending/accepted/rejected)

## 🛠️ Tech Stack

### Backend
- **Flask** 2.3.3 - Web framework
- **Flask-SQLAlchemy** 3.0.5 - ORM
- **Flask-Migrate** 4.0.5 - Migrations
- **Flask-JWT-Extended** 4.5.2 - JWT authentication
- **SQLite** - Database
- **SQLAlchemy** 2.0.21 - SQL toolkit

### Frontend
- **React** 18.2.0 - UI library
- **React Router DOM** 6.14.0 - Routing
- **ES6+ JavaScript** - Programming language

## 📁 Project Structure

```
flask-skillswap/
├── backend/
│   ├── app/
│   │   ├── __init__.py           # App factory
│   │   ├── config.py             # Configuration
│   │   ├── extensions.py         # Database & migration setup
│   │   ├── models.py             # Database models
│   │   ├── auth/
│   │   │   └── routes.py         # Auth endpoints
│   │   ├── users/
│   │   │   └── routes.py         # User endpoints
│   │   ├── skills/
│   │   │   └── routes.py         # Skill endpoints
│   │   └── requests/
│   │       └── routes.py         # Skill request endpoints
│   ├── run.py                    # Entry point
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # Environment variables
│   └── skillswap.db              # SQLite database (created after init)
│
└── frontend/
    ├── public/
    │   └── index.html            # Main HTML file
    ├── src/
    │   ├── api.js                # API service
    │   ├── App.js                # Main component
    │   ├── App.css               # Global styles
    │   ├── index.js              # Entry point
    │   └── pages/
    │       ├── Register.js       # Registration page
    │       ├── Login.js          # Login page
    │       ├── Dashboard.js      # Dashboard page
    │       ├── SkillsList.js     # Skills list page
    │       ├── CreateSkill.js    # Create skill page
    │       ├── MyRequests.js     # My requests page
    │       ├── auth.css          # Auth styles
    │       ├── dashboard.css     # Dashboard styles
    │       ├── skills.css        # Skills styles
    │       ├── create-skill.css  # Create skill styles
    │       └── requests.css      # Requests styles
    ├── package.json              # Node dependencies
    └── .gitignore
```

## 🚀 Setup Instructions

### Backend Setup

#### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

#### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 3. Configure Database

The application uses SQLite by default. No additional setup is needed. The database file will be created automatically in the `backend/` directory.

**config.py Details:**
```python
# Development (default)
SQLALCHEMY_DATABASE_URI = 'sqlite:///skillswap.db'

# For PostgreSQL in production:
# SQLALCHEMY_DATABASE_URI = 'postgresql://user:password@localhost/skillswap'
```

#### 4. Set Environment Variables

Edit or create `.env` file in the `backend/` directory:

```env
FLASK_ENV=development
FLASK_APP=run.py
JWT_SECRET_KEY=your-secret-key-change-this-in-production-12345
```

⚠️ **IMPORTANT**: Change `JWT_SECRET_KEY` in production to a strong random string!

#### 5. Initialize Database

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

#### 6. Run Backend Server

```bash
python run.py
```

Server runs on: `http://localhost:5000`

### Frontend Setup

#### 1. Install Dependencies

```bash
cd frontend
npm install
```

#### 2. Start Development Server

```bash
npm start
```

Frontend runs on: `http://localhost:3000`

## 🗄️ Database Configuration

### SQLite Configuration

**File**: `backend/app/config.py`

```python
class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///skillswap.db'
```

**Changes Required:**
- No changes needed! SQLite is already configured.
- Database file (`skillswap.db`) is created automatically in the project root.

### PostgreSQL (Production)

For production, you can use PostgreSQL:

```python
class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 
        'postgresql://user:password@localhost/skillswap'
    )
```

Install PostgreSQL driver:
```bash
pip install psycopg2-binary
```

## 🔐 JWT Authentication

### Secret Key Configuration

File: `backend/.env`

```env
JWT_SECRET_KEY=your-super-secret-key-minimum-32-characters
```

### JWT Token Format

**Token stored in localStorage:**
```javascript
// After successful login
localStorage.setItem('token', response.access_token);
```

**Using token in API requests:**
```javascript
const options = {
  headers: {
    'Authorization': `Bearer ${token}`
  }
};
```

### Token Expiration

Default: 24 hours (configurable in `config.py`)

```python
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
```

## 🔄 Running Migrations

### Initialize Migrations (First Time)

```bash
cd backend
flask db init
```

### Create Migration After Model Changes

```bash
flask db migrate -m "Describe your changes"
```

### Apply Migrations

```bash
flask db upgrade
```

### Rollback Migration

```bash
flask db downgrade
```

### View Migration History

```bash
flask db history
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Auth Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"  // or "admin"
}

Response: 201
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "created_at": "2024-01-01T10:00:00"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200
{
  "message": "Login successful",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Users Endpoints

#### Get Profile
```http
GET /users/profile
Authorization: Bearer <token>

Response: 200
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### List Users (Admin Only)
```http
GET /users/list
Authorization: Bearer <admin_token>

Response: 200
{
  "users": [
    {"id": 1, "name": "John Doe", "email": "john@example.com", "role": "student"},
    {"id": 2, "name": "Admin User", "email": "admin@example.com", "role": "admin"}
  ]
}
```

### Skills Endpoints

#### Create Skill
```http
POST /skills/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Python Programming",
  "description": "Learn Python from basics to advanced..."
}

Response: 201
{
  "message": "Skill created successfully",
  "skill": {
    "id": 1,
    "title": "Python Programming",
    "description": "Learn Python from basics to advanced...",
    "created_by": 1,
    "creator_name": "John Doe",
    "created_at": "2024-01-01T10:00:00"
  }
}
```

#### List All Skills
```http
GET /skills/list

Response: 200
{
  "skills": [
    {"id": 1, "title": "Python Programming", ...},
    {"id": 2, "title": "Web Design", ...}
  ]
}
```

#### Update Skill
```http
PUT /skills/<skill_id>/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Advanced Python Programming",
  "description": "Updated description..."
}

Response: 200
```

#### Delete Skill
```http
DELETE /skills/<skill_id>/delete
Authorization: Bearer <token>

Response: 200
{
  "message": "Skill deleted successfully"
}
```

### Skill Requests Endpoints

#### Request Skill
```http
POST /requests/request-skill
Authorization: Bearer <token>
Content-Type: application/json

{
  "skill_id": 1
}

Response: 201
{
  "message": "Skill request created successfully",
  "request": {
    "id": 1,
    "skill_id": 1,
    "skill_title": "Python Programming",
    "requester_id": 2,
    "requester_name": "Jane Doe",
    "status": "pending"
  }
}
```

#### Get My Requests
```http
GET /requests/my-requests
Authorization: Bearer <token>

Response: 200
{
  "requests": [
    {
      "id": 1,
      "skill_id": 1,
      "skill_title": "Python Programming",
      "requester_id": 2,
      "requester_name": "Jane Doe",
      "status": "pending"
    }
  ]
}
```

#### Get Received Requests
```http
GET /requests/received-requests
Authorization: Bearer <token>

Response: 200
{
  "requests": [...]
}
```

#### Accept Request
```http
PUT /requests/<request_id>/accept
Authorization: Bearer <token>

Response: 200
{
  "message": "Request accepted successfully",
  "request": {
    "id": 1,
    "status": "accepted",
    ...
  }
}
```

#### Reject Request
```http
PUT /requests/<request_id>/reject
Authorization: Bearer <token>

Response: 200
{
  "message": "Request rejected successfully"
}
```

## 🧪 Testing with Postman

### 1. Import Collection

Create a new collection in Postman with the following requests:

### 2. Setup Variables

In Postman, set collection variables:
- `base_url`: `http://localhost:5000/api`
- `token`: (will be set after login)

### 3. Test Workflow

**Step 1: Register User**
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "testpass123",
  "role": "student"
}
```

**Step 2: Login**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "testpass123"
}
```
- Copy the `access_token` from response
- Set it as environment variable: `token = <access_token>`

**Step 3: Create Skill**
```
POST http://localhost:5000/api/skills/create
Headers: Authorization: Bearer {{token}}
Body (JSON):
{
  "title": "JavaScript Programming",
  "description": "Complete guide to JavaScript..."
}
```

**Step 4: List Skills**
```
GET http://localhost:5000/api/skills/list
```

**Step 5: Request a Skill** (Use a different user)
```
POST http://localhost:5000/api/requests/request-skill
Headers: Authorization: Bearer {{token}}
Body (JSON):
{
  "skill_id": 1
}
```

**Step 6: Accept Request** (Use original user token)
```
PUT http://localhost:5000/api/requests/1/accept
Headers: Authorization: Bearer {{token}}
```

### Sample Postman Collection

```json
{
  "info": {
    "name": "SkillSwap API",
    "version": "1.0"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/register"
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/login"
          }
        }
      ]
    },
    {
      "name": "Skills",
      "item": [
        {
          "name": "Create Skill",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/skills/create",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

## 🌐 React Frontend - How to Call Flask API

### API Service (`api.js`)

```javascript
// GET request
const response = await fetch('http://localhost:5000/api/skills/list', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// POST request
const response = await fetch('http://localhost:5000/api/skills/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    title: 'Python',
    description: 'Learn Python'
  })
});

const data = await response.json();
```

### Using API Service in Components

```javascript
import { skillsAPI } from '../api';

function SkillsList() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await skillsAPI.listSkills();
        setSkills(response.skills);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadSkills();
  }, []);

  return (
    <div>
      {skills.map(skill => (
        <div key={skill.id}>{skill.title}</div>
      ))}
    </div>
  );
}
```

### JWT Token Handling

```javascript
// Store token after login
localStorage.setItem('token', response.access_token);
localStorage.setItem('user', JSON.stringify(response.user));

// Retrieve token for API calls
const token = localStorage.getItem('token');

// Clear token on logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

### CORS (If needed)

If you get CORS errors, add this to `app/__init__.py`:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
```

Install flask-cors:
```bash
pip install flask-cors
```

## 📱 Local Deployment

### Full Setup Checklist

- [ ] Backend virtual environment created and activated
- [ ] `pip install -r requirements.txt` completed
- [ ] `.env` file created with JWT_SECRET_KEY
- [ ] Database migrations run (`flask db upgrade`)
- [ ] Backend server running on `http://localhost:5000`
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend development server running on `http://localhost:3000`

### Running Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python run.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

Both will start with hot-reload enabled.

### Accessing the Application

- **Frontend**: `http://localhost:3000`
- **API**: `http://localhost:5000/api`

## 🐛 Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'flask'"
**Solution**: Activate virtual environment and run `pip install -r requirements.txt`

### Issue: "address already in use"
**Solution**: 
```bash
# Find process using port 5000 (backend) or 3000 (frontend)
lsof -i :5000  # or :3000
kill -9 <PID>
```

### Issue: "CORS errors in browser"
**Solution**: Install and enable Flask-CORS
```bash
pip install flask-cors
# Add CORS(app) in app/__init__.py
```

### Issue: "JWT token invalid"
**Solution**: 
- Check JWT_SECRET_KEY in `.env` and `config.py` are same
- Ensure token is included in Authorization header: `Bearer <token>`
- Check token hasn't expired (24 hours by default)

### Issue: Database not created
**Solution**: 
```bash
flask db init
flask db migrate -m "Initial"
flask db upgrade
python -c "from app import create_app, db; app = create_app(); app.app_context().push(); db.create_all()"
```

### Issue: React can't connect to API
**Solution**:
- Ensure backend is running on `http://localhost:5000`
- Check API URL in `frontend/src/api.js`
- Enable CORS in Flask backend
- Check browser console for specific error messages

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [JWT with Flask](https://flask-jwt-extended.readthedocs.io/)
- [React Documentation](https://reactjs.org/)
- [Flask-Migrate Documentation](https://flask-migrate.readthedocs.io/)

---

**Happy coding! 🚀**
#   f l a s k _ s k i l l s w a p  
 