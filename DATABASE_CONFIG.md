# Database & Configuration Guide

## 📋 Configuration Overview

The Flask application uses a configuration system that allows different settings for different environments (development, testing, production).

---

## 🗄️ SQLite Database Configuration

### File Location
`backend/app/config.py`

### Default Configuration
```python
class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///skillswap.db'
```

### What This Means
- **Engine**: SQLite (file-based database)
- **Database File**: `backend/skillswap.db`
- **Debug Mode**: Enabled (auto-reload on code changes)
- **No Server Setup Needed**: SQLite is serverless!

### Required Changes
✅ **NONE!** The database is already configured for SQLite.

The file `skillswap.db` will be automatically created in the `backend/` directory when you run:
```bash
flask db upgrade
```

---

## 🔐 Secret Keys Configuration

### File Location
`backend/.env`

### What Is SECRET_KEY and JWT_SECRET_KEY?

**SECRET_KEY**: Used for Flask session encryption
```python
app.config['SECRET_KEY'] = 'your-secret-key'
```

**JWT_SECRET_KEY**: Used for signing JWT tokens
```python
JWT_SECRET_KEY = 'your-jwt-secret'
```

### How to Set Them

**Step 1: Edit `.env` file**
```env
FLASK_ENV=development
FLASK_APP=run.py
JWT_SECRET_KEY=your-super-secret-key-minimum-32-characters
```

**Step 2: Generate a Strong Secret Key**

Using Python:
```python
import secrets
print(secrets.token_hex(32))
```

Using OpenSSL:
```bash
openssl rand -hex 32
```

### Example
```env
JWT_SECRET_KEY=7f9c2f42d8b5a1e3c9d6f4e2a8b5c1d9e3f7a4b9c2d5e8f1a4b7c0d3e6f9a
```

### ⚠️ Important Security Notes

1. **Never commit `.env` to Git** - It's in `.gitignore`
2. **Use different keys in production** - Avoid using development keys
3. **Minimum 32 characters** - The longer, the better
4. **Keep it random** - Use cryptographic randomness
5. **Rotate regularly** - Change keys periodically in production

---

## 📊 Database Configuration for Different Environments

### Development (SQLite)
```python
class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///skillswap.db'
    SQLALCHEMY_ECHO = True  # Log SQL queries
```
- **Use Case**: Local development
- **Setup**: No setup needed
- **Performance**: Good for development
- **File Size**: Single `.db` file

### Testing (In-Memory SQLite)
```python
class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_SECRET_KEY = 'test-secret-key'
```
- **Use Case**: Running unit tests
- **Setup**: Automatic (in-memory)
- **Performance**: Fast
- **Data**: Lost after test run

### Production (PostgreSQL)
```python
class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://user:password@localhost/skillswap'
    )
```
- **Use Case**: Production deployment
- **Setup**: PostgreSQL server required
- **Performance**: Excellent for production
- **Scalability**: Handles large datasets

---

## 🔄 Switching Database Configurations

### Current Environment
Set in `.env`:
```env
FLASK_ENV=development  # or testing, production
```

### Supported Values

| Value | Config Class | Use Case |
|-------|---|---|
| `development` | `DevelopmentConfig` | Local development |
| `testing` | `TestingConfig` | Unit tests |
| `production` | `ProductionConfig` | Production server |
| Default | `DevelopmentConfig` | If env var not set |

### Example: Switch to Production
```env
FLASK_ENV=production
DATABASE_URL=postgresql://user:pass@prod-server.com/skillswap
```

---

## 💾 Database File Location

### Development
```
flask-skillswap/
└── backend/
    ├── app/
    ├── run.py
    └── skillswap.db  ✅ Created here
```

### Backup Database
```bash
# Copy the database file to backup
cp backend/skillswap.db backend/skillswap.db.backup
```

### Delete Database (Reset)
```bash
# Remove database file
rm backend/skillswap.db

# Recreate from migrations
flask db upgrade
```

---

## 🔧 Configuration Class Details

### Base Config
```python
class Config:
    # Database
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    
    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # CORS
    CORS_HEADERS = 'Content-Type'
```

### Available Settings

| Setting | Default | Description |
|---------|---------|---|
| `SQLALCHEMY_TRACK_MODIFICATIONS` | `False` | Disable modification tracking |
| `SQLALCHEMY_ECHO` | `True` | Log SQL queries |
| `JWT_SECRET_KEY` | From `.env` | Token signing key |
| `JWT_ACCESS_TOKEN_EXPIRES` | `24 hours` | Token expiration time |
| `DEBUG` | `True` (dev) | Enable debug mode |

---

## 🚀 Production Setup

### PostgreSQL Installation

**MacOS:**
```bash
brew install postgresql
brew services start postgresql
createdb skillswap
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql
sudo -u postgres createdb skillswap
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### PostgreSQL Connection String
```
postgresql://username:password@localhost:5432/skillswap
```

### Update .env
```env
FLASK_ENV=production
DATABASE_URL=postgresql://postgres:password@localhost:5432/skillswap
JWT_SECRET_KEY=your-production-secret-key-here
```

### Install PostgreSQL Driver
```bash
pip install psycopg2-binary
```

### Run Migrations
```bash
flask db upgrade
```

---

## 🔍 Verify Configuration

### Check Current Configuration
```python
# Run in Python shell
python
>>> from app import create_app, db
>>> app = create_app()
>>> app.config['SQLALCHEMY_DATABASE_URI']
'sqlite:///skillswap.db'
>>> app.config['DEBUG']
True
```

### Check Environment Variables
```bash
# View all env vars
env | grep -i flask

# View specific var
echo $FLASK_ENV
```

---

## 📝 Common Configuration Changes

### Change Token Expiration
```python
# In config.py
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)  # 1 hour instead of 24
```

### Enable Query Logging
```python
# In config.py
SQLALCHEMY_ECHO = True
```

### Add CORS Support
```python
# Install
pip install flask-cors

# In app/__init__.py
from flask_cors import CORS
CORS(app)
```

### Change Database Path
```python
# In config.py
SQLALCHEMY_DATABASE_URI = 'sqlite:///path/to/skillswap.db'
```

---

## 🆘 Configuration Troubleshooting

### Issue: "No such file or directory: skillswap.db"
```bash
# Run migrations to create database
flask db upgrade
```

### Issue: "JWT_SECRET_KEY not set"
```bash
# Add to .env
JWT_SECRET_KEY=your-secret-key
```

### Issue: "Invalid database URL"
```bash
# Check database URL format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host:port/dbname
```

### Issue: "cannot import name 'Config'"
```bash
# Make sure app/config.py exists and has Config class
cat app/config.py | grep "class Config"
```

---

## 📚 Further Reading

- [Flask Configuration](https://flask.palletsprojects.com/en/2.3.x/config/)
- [SQLAlchemy Configuration](https://flask-sqlalchemy.palletsprojects.com/en/3.0.x/config/)
- [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/)
- [PostgreSQL Connection Strings](https://wiki.postgresql.org/wiki/Number_Database_Connections)

---

**All set! Your database is ready to use.** 🎉
