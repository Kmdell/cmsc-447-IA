from flask import Flask, request, make_response
from flask_json import FlaskJSON
from databases import Database

app = Flask(__name__)
FlaskJSON(app)

db = Database('sqlite+aiosqlite:///individual.db')
endpoints = ["course", "student", "instructor", "grade"]

def parse(data):
    # parse data to a dictionary for easier js manipulation and firefox understanding
    resp = []
    for row in data:
        resp.append(row._asdict())
    return resp

async def create(endpoint):
    # for creation of object uses json to hold most of content to be passed to the sql creation query
    if endpoint == 'course':
        values = {'course_title': request.json['course_title'], 'instructor_id': None if 'instructor_id' not in request.json else request.json['instructor_id']}
        query = "INSERT INTO Courses(course_title, instructor_id) VALUES (:course_title, :instructor_id)"
    elif endpoint == 'student':
        values = {'name': request.json['name'], 'credits_earned': 0 if 'credits_earned' not in request.json else request.json['credits_earned']}
        query = "INSERT INTO Instructors(name, credits_earned) VALUES (:name, :credits_earned)"
    elif endpoint == 'instructor':
        values = {'name': request.json['name'], 'department': request.json['department']}
        query = "INSERT INTO Instructors(name, department) VALUES (:name, :department)"
    elif endpoint == "grade":
        values = {'course_id': request.json['course_id'], 'student_id': request.json['student_id']}
        query = "INSERT INTO Grades(course_id, student_id) VALUES (:course_id, :student_id)"
    else:
        # returns 404 if somehow using a wrong endpoint
        return make_response({}, 404)
    await db.execute(query=query, values=values)
    return request.json

async def index(endpoint):
    # alerts the user that the Flask server is running
    if endpoint is None:
        return "Flask is running"
    # gets all the data from the tables for perusing multiple
    elif endpoint in endpoints:   
        if endpoint == 'course':
            data = await db.fetch_all(query="SELECT * FROM Courses")
        elif endpoint == 'student':
            data = await db.fetch_all(query="SELECT * FROM Students")
        elif endpoint == 'instructor':
            data = await db.fetch_all(query="SELECT * FROM Instructors")
        elif endpoint == 'grade':  
            data = await db.fetch_all(query="SELECT * FROM Grades")
        return parse(data)
        
async def query_id(endpoint, id):
    await db.connect()
    if request.method == 'POST':
        # for updating entities
        if endpoint == 'course':
            query = "UPDATE Courses SET course_title = {}, instructor_id = {} WHERE course_id = {}".format(request.json['course_title'], request.json['instructor_id'], id)
        elif endpoint == 'student':
            query = "UPDATE Students SET name = {}, credits_earned = {} WHERE student_id = {}".format(request.json['name'], request.json['credits_earned'], id)
        elif endpoint == 'instructor':
            query = "UPDATE Instructors SET name = {}, department = {} WHERE instructor_id = {}".format(request.json['name'], request.json['department'], id)
    else:
        # return the entity based on id
        if endpoint == 'course':
            query = "SELECT * FROM Courses WHERE course_id = {}".format(id)
        elif endpoint == 'student':
            query = "SELECT * FROM Students WHERE student_id = {}".format(id)
        elif endpoint == 'instructor':
            query = "SELECT * FROM Instructors WHERE instructor_id = {}".format(id)
        else:
            # return 404 if wrong endpoint is used
            return make_response({}, 404)
        data = await db.fetch_all(query=query)
        return parse(data)

async def query_id_grade(course_id, student_id):
    await db.connect()
    # for updating the grades
    if request.method == "POST":
        await db.execute(query="UPDATE Grades SET grade = {} WHERE (course_id = {}, student_id = {})".format(request.json['grade'], course_id, student_id))    
    resp = []
    # for getting the data depending on the ids
    if course_id > 0 and student_id > 0:
        data = await db.fetch_all("SELECT * FROM Instructors WHERE (course_id = {} AND student_id = {})".format(course_id, student_id))
        resp = parse(data)
    else:
        # will get all the data based on one id
        data = await index('grade')
        if course_id < 1:
            for row in data:
                if row['student_id'] == student_id:
                    resp.append(row)
        if student_id < 1:
            for row in data:
                if row['course_id'] == course_id:
                    resp.append(row)
    return resp

async def delete(endpoint, id):
    # deletes the chosen entity based on the id
    await db.connect()
    if endpoint == 'course':
        query = "DELETE FROM Courses WHERE course_id = {}".format(id)
    elif endpoint == 'student':
        query = "DELETE FROM Students WHERE student_id = {}".format(id)
    elif endpoint == 'instructor':
        query = "DELETE FROM Instructors WHERE instructor_id = {}".format(id)
    else:
        # if smehow trying to delete an endpoint that doesnt exit return 404
        return make_response({}, 404)
    data = await query_id(endpoint, id)
    await db.execute(query=query)
    return data
    
async def delete_grade(course_id, student_id):
    await db.connect()
    # deletes the grade based on the composite key
    query = "DELETE FROM Grades WHERE (course_id = {} AND student_id = {})".format(course_id, student_id)
    data = query_id_grade(course_id, student_id)
    await db.execute(query=query)
    return data

# create all necessary CRUD API url rules
for endpoint in endpoints:
    # all the GET commands for robust choice and last two are also for updating
    app.add_url_rule("/", view_func=index, methods=["GET"], defaults={'endpoint': None})
    app.add_url_rule("/" + endpoint, view_func=index, methods=["GET"], defaults={'endpoint': endpoint})
    app.add_url_rule("/" + endpoint + "/<int:id>", view_func=query_id, methods=["GET", "POST"], defaults={'endpoint': endpoint})
    app.add_url_rule("/grade/<int:course_id>/<int:student_id>", view_func=query_id_grade, methods=["GET", "POST"])
    # all the PUT for deletion
    app.add_url_rule("/" + endpoint + "/<int:id>", view_func=delete, methods=["PUT"], defaults={'endpoint': endpoint})
    app.add_url_rule("/grade/<int:course_id>/<int:student_id>", view_func=delete_grade, methods=["PUT"])
    # all the POST for creation
    app.add_url_rule("/" + endpoint, view_func=create, methods=["POST"], defaults={'endpoint': endpoint})