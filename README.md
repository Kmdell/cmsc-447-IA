# cmsc-447-IA
Individual Assignment for CMSC447, simple CRUD web app for student, course, and instructor management

Verified on Chromium
Ran on Ubuntu 22.04

# Install dependencies for flask server and run
```
cd backend
pip3 install databases aiosqlite flask flask_json flask_cors flask[async] sqlite3
flask --app server.py run
```

# Install and run frontend
```
cd frontend
npm i
npm start
```