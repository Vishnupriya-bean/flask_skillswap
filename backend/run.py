import os
from app import create_app
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Create app
app = create_app(os.getenv('FLASK_ENV', 'development'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
