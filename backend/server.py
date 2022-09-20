from flask import Flask, request, jsonify

app = Flask(__name__)

endpoints = ["course", "student", "instructor"]

def index(endpoint):
    if endpoint is None:
        return "Flask is running"
    elif endpoint in endpoints:
        return "hello, the " + endpoint + " endpoint is functioning properly"

def query_id(endpoint):
    return "Querying ID: {} in the ".format(id) + endpoint + " endpoint"

def create(endpoint):
    if endpoint == 'course':
        return request.json
    elif endpoint == 'student':
        return request.json
    elif endpoint == 'instructor':
        return request.json
    else:
        return {}


for endpoint in endpoints:
    app.add_url_rule("/", view_func=index, methods=["GET"], defaults={'endpoint': None})
    app.add_url_rule("/" + endpoint, view_func=index, methods=["GET"], defaults={'endpoint': endpoint})
    app.add_url_rule("/" + endpoint + "/<int:id>", view_func=query_id, methods=["GET"], defaults={'endpoint': endpoint})
    app.add_url_rule("/" + endpoint, view_func=create, methods=["POST"], defaults={'endpoint': endpoint})