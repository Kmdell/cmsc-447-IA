import React from "react";
import './App.css';
import {useParams, useNavigate} from 'react-router-dom'
import {Button, Row, Col, Form, Table} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faTemperature0 } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/css/bootstrap.min.css';

function New() {
    const navigate = useNavigate();
    const [form, setForm] = React.useState({});
    const [enroll, setEnroll] = React.useState([]);
    const [dropdown, setDropdown] = React.useState([]);
    const [grades, setGrade] = React.useState(null);
    const [value, setValue] = React.useState(null);
    const { endpoint, id } = useParams();
    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    function handleDelete(course_id, student_id) {
        fetch("http://127.0.0.1:5000/grade/" + course_id + "/" + student_id, {method: "PUT"})
          .then(() => {
            window.location.reload();
        });
    }

    function handleRedirect(endpoint, id0, id1) {
        navigate('/' + endpoint + "/edit/" + id0 + "/" + id1)
    }

    React.useEffect(() => {
        async function fetchData() {
            {console.log(endpoint)}
            await delay(100)  
            await fetch("http://127.0.0.1:5000/" + endpoint + "/" + id, {method: "GET"})
                .then((res) => res.json())
                .then((data) => setForm(data[0]));
            if (endpoint == "course") {
                await fetch("http://127.0.0.1:5000/grade/" + id + "/0", {method: "GET"})
                    .then((res) => res.json())
                    .then((data) => setGrade(data));
            } else if (endpoint == "student") {
                await fetch("http://127.0.0.1:5000/grade/0/" + id, {method: "GET"})
                    .then((res) => res.json())
                    .then((data) => setGrade(data));
            }
        }
        fetchData();
      }, []);

    const handleSubmit = (event) => {
        const _form = event.currentTarget;
        if (_form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            const reqOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            };
            console.log(reqOptions)
            fetch('http://127.0.0.1:5000/' + endpoint + "/" + id, reqOptions)
                .then((res) => res.json())
                .then((data) => console.log(data))
        }
        navigate('/')
    }

    const setField = (field, value) => {
        setForm({
          ...form,
          [field]: value,
        })
    }

    return (
        <>
            {(endpoint === String("instructor"))?
            <div className="Table">
                <br/>
                <h1>Edit Instructor</h1>
                <hr/>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>Instructor's Name</Form.Label>
                                <Form.Control type="text" onChange={e => setField('name', e.target.value)} defaultValue={form.name} placeholder="Enter the Instructor's Name"/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formDepartment">
                                <Form.Label>Instructor's Department</Form.Label>
                                <Form.Control type="text" onChange={e => setField('department', e.target.value)} defaultValue={form.department} placeholder="Enter the Instructor's Department"/>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                <Button type="submit" onClick={handleSubmit}>Submit</Button>
            </div>
            : ((endpoint === String("student"))?
                <div className="Table">
                    <br/>
                    <h1>Edit Student</h1>
                    <hr/>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Student's Name</Form.Label>
                                    <Form.Control type="text" onChange={e => setField('name', e.target.value)} defaultValue={form.name} placeholder="Enter the Instructor's Name"/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formCreditsEarned">
                                    <Form.Label>Student's Credits Earned</Form.Label>
                                    <Form.Control type="text" onChange={e => setField('credits_earned', e.target.value)} defaultValue={form.credits_earned} placeholder="Enter the Instructor's Department"/>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                    <Button type="submit" onClick={handleSubmit}>Submit</Button>
                    <br/>
                    <br/>
                    <h3>Courses</h3>
                    <hr/>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Course ID</th>
                            <th>Grade</th>
                            <th>Edit</th>
                            <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades == null?
                            <tr>
                            <td colSpan={5}>Loading...</td>
                            </tr>
                            :
                            grades.map((info) => {
                            return(<tr>
                                <td>{info.course_id}</td>
                                <td>{info.grade}</td>
                                <td>
                                <Button onClick={() => {handleRedirect("grade", info.course_id, info.student_id)}}>
                                    <FontAwesomeIcon icon={faEdit}/>
                                </Button>
                                </td>
                                <td>
                                <Button variant="primary" onClick={() => {handleDelete(info.course_id, info.student_id)}}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                                </td>
                            </tr>)
                            })}
                        </tbody>
                    </Table>
                </div>
            :
                ((endpoint === String("course"))?
                <div className="Table">
                    <br/>
                    <h1>Edit Course</h1>
                    <hr/>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Course's Title</Form.Label>
                                    <Form.Control type="text" onChange={e => setField('course_title', e.target.value)} defaultValue={form.course_title} placeholder="Enter the Instructor's Name"/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formDepartment">
                                    <Form.Label>Instructor's ID</Form.Label>
                                    <Form.Control type="text" onChange={e => setField('instructor_id', e.target.value)} defaultValue={form.instructor_id} placeholder="Enter the Instructor's Department"/>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                    <Button type="submit" onClick={handleSubmit}>Submit</Button>
                    <br/>
                    <br/>
                    <h3>Students</h3>
                    <hr/>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Student ID</th>
                            <th>Grade</th>
                            <th>Edit</th>
                            <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {console.log(enroll)}
                            {grades == null?
                            <tr>
                            <td colSpan={5}>Loading...</td>
                            </tr>
                            :
                            grades.map((info) => {
                            return(<tr>
                                <td>{info.student_id}</td>
                                <td>{info.grade}</td>
                                <td>
                                <Button onClick={() => {handleRedirect("grade", info.course_id, info.student_id)}}>
                                    <FontAwesomeIcon icon={faEdit}/>
                                </Button>
                                </td>
                                <td>
                                <Button variant="primary" onClick={() => {handleDelete(info.course_id, info.student_id)}}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                                </td>
                            </tr>)
                            })}
                        </tbody>
                    </Table>
                </div>
            :
                <div>
                    <h1>404</h1>
                </div>
            ))}
        </>   
    )
}

export default New;