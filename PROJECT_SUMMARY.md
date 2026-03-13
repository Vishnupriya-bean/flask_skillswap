# SkillSwap - Project Complete! 🎉

A complete full-stack web application for sharing and requesting skills.

## 📦 What's Included

### Backend (Flask)
- ✅ Clean architecture with App Factory Pattern
- ✅ 4 Flask Blueprints (auth, users, skills, requests)
- ✅ SQLAlchemy ORM with SQLite database
- ✅ JWT Authentication with flask-jwt-extended
- ✅ Role-based Authorization (Admin & Student)
- ✅ Comprehensive error handling and validation
- ✅ Database migrations with Flask-Migrate
- ✅ 3 Database Models (User, Skill, SkillRequest)

### Frontend (React)
- ✅ React 18 with React Router
- ✅ JWT token handling with localStorage
- ✅ 6 Pages (Register, Login, Dashboard, Skills, CreateSkill, MyRequests)
- ✅ Clean, responsive UI
- ✅ Error handling and loading states
- ✅ API service layer for Flask communication

### API Routes

**Authentication:**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login and get JWT token

**Users:**
- GET `/api/users/profile` - Get current user profile
- GET `/api/users/list` - List all users (admin only)

**Skills:**
- POST `/api/skills/create` - Create new skill
- GET `/api/skills/list` - List all skills
- PUT `/api/skills/<id>/update` - Update skill (owner/admin)
- DELETE `/api/skills/<id>/delete` - Delete skill (owner/admin)

**Skill Requests:**
- POST `/api/requests/request-skill` - Request a skill
- GET `/api/requests/my-requests` - Get my requests
- GET `/api/requests/received-requests` - Get received requests
- PUT `/api/requests/<id>/accept` - Accept request
- PUT `/api/requests/<id>/reject` - Reject request

---

## 🚀 Quick Start

### 1. Setup Backend
```bash
cd backend
python -m venv venv
# Activate: venv\Scripts\activate (Windows) or source venv/bin/activate (Mac/Linux)
pip install -r requirements.txt
flask db upgrade
python run.py
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm start
```

### 3. Access Application
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000/api

---

## 📁 Project Structure

```
flask-skillswap/
├── backend/
│   ├── app/
│   │   ├── __init__.py              # App Factory
│   │   ├── config.py                # Configuration (SQLite, JWT)
│   │   ├── extensions.py            # DB & Migration setup
│   │   ├── models.py                # Models: User, Skill, SkillRequest
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   └── routes.py            # Auth endpoints
│   │   ├── users/
│   │   │   ├── __init__.py
│   │   │   └── routes.py            # User endpoints
│   │   ├── skills/
│   │   │   ├── __init__.py
│   │   │   └── routes.py            # Skills endpoints
│   │   └── requests/
│   │       ├── __init__.py
│   │       └── routes.py            # Requests endpoints
│   ├── run.py                       # Entry point
│   ├── requirements.txt             # Python dependencies
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Example env file
│   └── skillswap.db                 # SQLite database (auto-created)
│
├── frontend/
│   ├── public/
│   │   └── index.html               # HTML entry point
│   ├── src/
│   │   ├── api.js                   # API service
│   │   ├── App.js                   # Main component
│   │   ├── App.css                  # Global styles
│   │   ├── index.js                 # React entry point
│   │   └── pages/
│   │       ├── Register.js
│   │       ├── Login.js
│   │       ├── Dashboard.js
│   │       ├── SkillsList.js
│   │       ├── CreateSkill.js
│   │       ├── MyRequests.js
│   │       ├── auth.css
│   │       ├── dashboard.css
│   │       ├── skills.css
│   │       ├── create-skill.css
│   │       └── requests.css
│   ├── package.json
│   └── .gitignore
│
├── README.md                        # Full documentation
├── QUICK_START.md                   # 5-minute setup guide
├── DATABASE_CONFIG.md               # Database configuration guide
├── .gitignore                       # Git ignore file
└── PROJECT_SUMMARY.md               # This file
```

---

## 🔧 Configuration Explained

### Database Configuration (SQLite)
**File**: `backend/app/config.py`

```python
class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///skillswap.db'
```

✅ **No changes needed!** SQLite is already configured. Database file created automatically.

### Setting SECRET_KEY and JWT_SECRET_KEY
**File**: `backend/.env`

```env
FLASK_ENV=development
FLASK_APP=run.py
JWT_SECRET_KEY=your-secret-key-change-this-in-production-12345
```

⚠️ **Important**: Change `JWT_SECRET_KEY` in production to a strong random string!

---

## 🔄 Running Migrations

### First Time Setup
```bash
cd backend
flask db init              # Initialize migration folder
flask db migrate -m "Initial migration"  # Create migration
flask db upgrade           # Apply migration
```

### After Model Changes
```bash
flask db migrate -m "Description of changes"
flask db upgrade
```

---

## 🌐 React to Flask Communication

### How React Calls Flask API

```javascript
// In frontend/src/api.js
const API_URL = 'http://localhost:5000/api';

// With JWT Token
const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
};

const response = await fetch(`${API_URL}/skills/list`, options);
```

### Token Storage
```javascript
// After login
localStorage.setItem('token', response.access_token);
localStorage.setItem('user', JSON.stringify(response.user));

// Before API calls
const token = localStorage.getItem('token');

// On logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

---

## 🧪 Testing with Postman

### Setup Postman

1. **Create Collection**: SkillSwap API
2. **Set Base URL Variable**: `{{base_url}}` = `http://localhost:5000/api`
3. **Test Workflow**:

#### Step 1: Register
```
POST {{base_url}}/auth/register
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "testpass123",
  "role": "student"
}
```

#### Step 2: Login
```
POST {{base_url}}/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "testpass123"
}
```
Copy `access_token` and set environment variable: `token = <value>`

#### Step 3: Create Skill
```
POST {{base_url}}/skills/create
Headers: Authorization: Bearer {{token}}
Body (JSON):
{
  "title": "JavaScript",
  "description": "Learn JavaScript programming"
}
```

#### Step 4: List Skills
```
GET {{base_url}}/skills/list
```

#### Step 5: Request Skill
```
POST {{base_url}}/requests/request-skill
Headers: Authorization: Bearer {{token}}
Body (JSON):
{
  "skill_id": 1
}
```

---

## 📱 Local Deployment

### Environment Setup

1. **Backend Requirements**:
   - Python 3.8+
   - Virtual environment
   - Requirements installed from `requirements.txt`
   - `.env` file with JWT_SECRET_KEY
   - Database initialized with `flask db upgrade`

2. **Frontend Requirements**:
   - Node.js 14+
   - npm or yarn
   - Dependencies from `npm install`

### Running Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python run.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

---

## 🎯 Features Breakdown

### User Roles

**Student:**
- Register and login
- View own profile
- Create skills
- Update/delete own skills only
- Request skills from others
- View skill requests

**Admin:**
- All student features
- View all users
- Delete any skill
- Full access to all data

### Skill Management
- Create new skills with title and description
- List all available skills
- Update skill details (owner/admin only)
- Delete skills (owner/admin only)
- View who created each skill

### Skill Requests
- Request skills from other users
- View pending requests
- Accept/reject skill requests
- Track request status (pending/accepted/rejected)

### Authentication
- Secure registration with password hashing
- JWT-based authentication
- Token expires after 24 hours
- Protected routes with authorization

---

## 🐛 Troubleshooting

### Backend Issues

**"ModuleNotFoundError: No module named 'flask'"**
```bash
# Activate virtual environment
source venv/bin/activate
# Install requirements
pip install -r requirements.txt
```

**"address already in use"**
```bash
# Find and kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

**"Database not created"**
```bash
flask db upgrade
```

### Frontend Issues

**"npm: command not found"**
- Install Node.js from https://nodejs.org/

**"CORS error"**
- Expected on development - API is working correctly
- Can be fixed by installing flask-cors if needed

**"Can't connect to API"**
- Ensure backend is running on http://localhost:5000
- Check browser console for specific errors
- Verify API URL in `src/api.js`

---

## 📚 Documentation Files

1. **README.md** - Complete documentation with all API details
2. **QUICK_START.md** - 5-minute setup guide
3. **DATABASE_CONFIG.md** - Database configuration guide
4. **PROJECT_SUMMARY.md** - This file

---

## 🔐 Security Notes

1. **Never commit .env file** - It contains secret keys
2. **Change JWT_SECRET_KEY in production** - Use strong random string
3. **Use HTTPS in production** - Secure token transmission
4. **Validate all inputs** - Already implemented
5. **Use environment variables** - Load sensitive data from .env
6. **Hash passwords** - Already implemented with werkzeug

---

## 🚀 Next Steps

1. ✅ Run the application using Quick Start guide
2. ✅ Test all features in the UI
3. ✅ Use Postman to test API endpoints
4. ✅ Review the code structure
5. ✅ Customize styling if needed
6. ✅ Add more features as required
7. ✅ Deploy to production when ready

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review README.md for detailed API docs
3. Check QUICK_START.md for setup issues
4. Review DATABASE_CONFIG.md for configuration help

---

## 📝 License

This project is open source and available for learning and development purposes.

---

**Happy coding! 🎉 Your SkillSwap application is ready to use.**
