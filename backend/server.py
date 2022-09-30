from flask import Flask, request, make_response
from flask_cors import CORS
from flask_json import FlaskJSON
import sqlite3
import threading

app = Flask(__name__)
CORS(app)
FlaskJSON(app)
conn = sqlite3.connect('individual.db', check_same_thread=False)
conn.execute("PRAGMA foreign_keys = 1")
conn.row_factory = sqlite3.Row
cur = conn.cursor()
endpoints = ["course", "student", "instructor", "grade"]
lock = threading.Lock()

def parse(data):
    temp = []
    for row in data:
        temp.append(dict(row))
    return temp

def index(endpoint):
    if request.method == "POST":
        # for creation of object uses json to hold most of content to be passed to the sql creation query
        if endpoint == 'course':
            if not 'instructor_id' in request.json:
                query = "INSERT INTO Courses(course_title) VALUES ('{}')".format(request.json['course_title'])
            else:
                query = "INSERT INTO Courses(course_title, instructor_id) VALUES ('{}', {})".format(request.json['course_title'], request.json['instructor_id'])
        elif endpoint == 'student':
            query = "INSERT INTO Students(name, credits_earned) VALUES ('{}', {})".format(request.json['name'], 0 if 'credits_earned' not in request.json else request.json['credits_earned'])
        elif endpoint == 'instructor':
            query = "INSERT INTO Instructors(name, department) VALUES ('{}', '{}')".format(request.json['name'], request.json['department'])
        elif endpoint == "grade":
            request.method = "GET"
            data = query_id_grade(int(request.json['course_id']), int(request.json['student_id']))
            query = ""
            if data == []:
                query = "INSERT INTO Grades(course_id, student_id, grade) VALUES ({}, {}, {})".format(request.json['course_id'], request.json['student_id'], 0 if 'grade' not in request.json else request.json['grade'])
        else:
            # returns 404 if somehow using a wrong endpoint
            return make_response({}, 404)
        if not query == "":
            lock.acquire()
            try:
                cur.execute(query)
                conn.commit()
            except:
                lock.release()
        lock.release()
        return request.json
    else:
        # alerts the user that the Flask server is running
        if endpoint is None:
            return "Flask is running"
        # gets all the data from the tables for perusing multiple
        elif endpoint in endpoints:  
            lock.acquire() 
            if endpoint == 'course':
                data = cur.execute("SELECT * FROM Courses")
                data = data.fetchall()
            elif endpoint == 'student':
                data = cur.execute("SELECT * FROM Students")
                data = data.fetchall()
            elif endpoint == 'instructor':
                data = cur.execute("SELECT * FROM Instructors")
                data = data.fetchall()
            elif endpoint == 'grade':
                data = cur.execute("SELECT * FROM Grades")
                data = data.fetchall()
            lock.release()
            return parse(data)

def query_id(endpoint, id):
    if request.method == 'POST':
        data = []
        # for updating entities
        if endpoint == 'course':
            query = "UPDATE Courses SET course_title = '{}', instructor_id = {} WHERE course_id = {}".format(request.json['course_title'], request.json['instructor_id'], id)
        elif endpoint == 'student':
            query = "UPDATE Students SET name = '{}', credits_earned = {} WHERE student_id = {}".format(request.json['name'], request.json['credits_earned'], id)
        elif endpoint == 'instructor':
            query = "UPDATE Instructors SET name = '{}', department = '{}' WHERE instructor_id = {}".format(request.json['name'], request.json['department'], id)
        lock.acquire()
        try:
            cur.execute(query)
            conn.commit()
        except:
            data = make_response({}, 500)
        lock.release()
        return data
    elif request.method == 'PUT':
        if endpoint == 'course':
            query = "SELECT * FROM Courses WHERE course_id = {}".format(id)
            del_query = "DELETE FROM Courses WHERE course_id = {}".format(id)
        elif endpoint == 'student':
            query = "SELECT * FROM Students WHERE student_id = {}".format(id)
            del_query = "DELETE FROM Students WHERE student_id = {}".format(id)
        elif endpoint == 'instructor':
            query = "SELECT * FROM Instructors WHERE instructor_id = {}".format(id)
            del_query = "DELETE FROM Instructors WHERE instructor_id = {}".format(id)
        else:
            # if smehow trying to delete an endpoint that doesnt exit return 404
            return make_response({}, 404)
        lock.acquire()
        try:
            data = cur.execute(query)
            data = data.fetchall()
            cur.execute(del_query)
            conn.commit()
        except:
            data = make_response({}, 500)
        lock.release()
        return data
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
        lock.acquire()
        data = cur.execute(query)
        data = data.fetchall()
        lock.release()
        return parse(data)    

def query_id_grade(course_id, student_id):
    
    resp = []
    # for getting the data depending on the ids
    if course_id > 0 and student_id > 0:
        lock.acquire()
        data = cur.execute("SELECT * FROM Grades WHERE (course_id = {} AND student_id = {})".format(course_id, student_id))
        data = data.fetchall()
        lock.release()
        resp = parse(data)
    else:
        # will get all the data based on one id
        request.method = "GET"
        data = index('grade')
        if course_id < 1:
            for row in data:
                if row['student_id'] == student_id:
                    resp.append(row)
        if student_id < 1:
            for row in data:
                if row['course_id'] == course_id:
                    resp.append(row)
    # deletes the grade based on the composite key
    if request.method == "PUT":
        lock.acquire()
        cur.execute("DELETE FROM Grades WHERE (course_id = {} AND student_id = {})".format(course_id, student_id))
        conn.commit()
        lock.release()
    # for updating the grades
    elif request.method == "POST":
        lock.acquire()
        cur.execute("UPDATE Grades SET grade = {} WHERE (course_id = {} AND student_id = {})".format(request.json['grade'], course_id, student_id))    
        conn.commit()
        lock.release()
    return resp

# create all necessary CRUD API url rules
for endpoint in endpoints:
    # all the GET commands for robust choice and post for creating and updating
    app.add_url_rule("/", view_func=index, methods=["GET"], defaults={'endpoint': None})
    app.add_url_rule("/" + endpoint, view_func=index, methods=["GET", "POST"], defaults={'endpoint': endpoint})
    app.add_url_rule("/" + endpoint + "/<int:id>", view_func=query_id, methods=["GET", "POST", "PUT"], defaults={'endpoint': endpoint})
    app.add_url_rule("/grade/<int:course_id>/<int:student_id>", view_func=query_id_grade, methods=["GET", "POST", "PUT"])