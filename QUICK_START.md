# SkillSwap - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

---

## Step 1: Setup Backend

### 1.1 Navigate to backend directory
```bash
cd backend
```

### 1.2 Create virtual environment
```bash
python -m venv venv
```

### 1.3 Activate virtual environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 1.4 Install dependencies
```bash
pip install -r requirements.txt
```

### 1.5 Initialize database
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 1.6 Run backend server
```bash
python run.py
```

✅ Backend running on: `http://localhost:5000`

---

## Step 2: Setup Frontend

### 2.1 Open new terminal and navigate to frontend
```bash
cd frontend
```

### 2.2 Install dependencies
```bash
npm install
```

### 2.3 Start development server
```bash
npm start
```

✅ Frontend running on: `http://localhost:3000`

---

## Step 3: Test the Application

### 3.1 Open Browser
Navigate to: **`http://localhost:3000`**

### 3.2 Register User
- Click "Register" button
- Fill in:
  - Name: `John Doe`
  - Email: `john@example.com`
  - Password: `password123`
  - Role: `student`
- Click "Register"

### 3.3 Login
- Email: `john@example.com`
- Password: `password123`
- Click "Login"

### 3.4 Create a Skill
- Click "Create Skill" from navbar
- Enter:
  - Title: `Python Programming`
  - Description: `Learn Python from basics to advanced`
- Click "Create Skill"

### 3.5 Browse Skills
- Click "Skills" from navbar
- See your created skill listed

### 3.6 Request a Skill
- Register a second user
- Login with second account
- Go to "Skills"
- Click "Request Skill" on the first user's skill

---

## 📝 Key Files to Understand

### Backend
- `app/config.py` - Database and JWT configuration
- `app/models.py` - Database models (User, Skill, SkillRequest)
- `app/auth/routes.py` - Authentication endpoints
- `app/skills/routes.py` - Skill CRUD operations

### Frontend
- `src/api.js` - API service for Flask communication
- `src/pages/Dashboard.js` - Main dashboard page
- `src/pages/SkillsList.js` - Browse skills page
- `src/pages/CreateSkill.js` - Create new skill page

---

## 🔧 Important Configuration

### Database (config.py)
```python
# SQLite (default - already configured)
SQLALCHEMY_DATABASE_URI = 'sqlite:///skillswap.db'

# No additional setup needed!
```

### JWT Secret Key (.env)
```env
JWT_SECRET_KEY=your-secret-key-change-in-production
```

⚠️ **Change this in production to a strong random string!**

---

## 🧪 API Testing (Optional)

### Using Postman

1. **Register:**
```
POST http://localhost:5000/api/auth/register
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "pass123",
  "role": "student"
}
```

2. **Login:**
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "test@example.com",
  "password": "pass123"
}
```
- Save the `access_token` from response

3. **Create Skill:**
```
POST http://localhost:5000/api/skills/create
Headers: Authorization: Bearer <your_token>
Body: {
  "title": "JavaScript",
  "description": "Learn JavaScript"
}
```

4. **List Skills:**
```
GET http://localhost:5000/api/skills/list
```

---

## 🐛 Common Issues

### Issue: "Port 5000 already in use"
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### Issue: "ModuleNotFoundError: No module named 'flask'"
```bash
# Make sure virtual environment is activated
# Then run: pip install -r requirements.txt
```

### Issue: "npm: command not found"
```bash
# Install Node.js from https://nodejs.org/
```

### Issue: "CORS error in browser"
This is normal on development. The API is working correctly.

---

## 📚 Next Steps

1. Create more users and test skill request flow
2. Check out the full README.md for detailed API documentation
3. Explore the code structure to understand the architecture
4. Customize the UI in the `frontend/src/pages/` directory
5. Add more features as needed

---

## 🎯 Project Features Checklist

- ✅ User Authentication (Register, Login)
- ✅ Role-based Authorization (Admin, Student)
- ✅ Create, Read, Update, Delete Skills
- ✅ Request Skills from Other Users
- ✅ Accept/Reject Skill Requests
- ✅ JWT Token-based Authorization
- ✅ Responsive UI
- ✅ Error Handling

---

**Ready to start? Run the backend and frontend servers and visit `http://localhost:3000`!** 🎉

For more details, see [README.md](../README.md)
