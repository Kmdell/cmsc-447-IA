# cmsc-447-IA
Individual Assignment for CMSC447, simple CRUD web app for student, course, and instructor management

# Install dependencies for flask server
cd backend
. bin/activate
pip3 install databases aiosqlite flask flask_json flask[async]
flask --app server.py run