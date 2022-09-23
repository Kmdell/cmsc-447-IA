import React from "react";
import './App.css';
import {useParams, useNavigate } from 'react-router-dom'
import {Button, Row, Col, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function New() {
    const navigate = useNavigate();
    const [form, setForm] = React.useState({});
    const [validated, setValidated] = React.useState(false);
    const { endpoint } = useParams()

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
            fetch('http://127.0.0.1:5000/' + endpoint, reqOptions)
                .then((res) => res.json())
                .then((data) => console.log(data))
        }
        setValidated(true);
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
                <h1>Create a New Instructor</h1>
                <hr/>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>Instructor's Name</Form.Label>
                                <Form.Control type="text" onChange={e => setField('name', e.target.value)} placeholder="Enter the Instructor's Name"/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formDepartment">
                                <Form.Label>Instructor's Department</Form.Label>
                                <Form.Control type="text" onChange={e => setField('department', e.target.value)} placeholder="Enter the Instructor's Department"/>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                <Button type="submit" onClick={handleSubmit}>Submit</Button>
            </div>
            : ((endpoint === String("student"))?
                <div className="Table">
                <br/>
                <h1>Create a New Student</h1>
                <hr/>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>Student's Name</Form.Label>
                                <Form.Control type="text" onChange={e => setField('name', e.target.value)} placeholder="Enter the Student's Name"/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formCreditsEarned">
                                <Form.Label>Student's Credits Earned</Form.Label>
                                <Form.Control type="text" onChange={e => setField('credits_earned', e.target.value)} placeholder="Enter the Amount of Credits"/>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                <Button type="submit" onClick={handleSubmit}>Submit</Button>
                </div>
             :
                ((endpoint === String("course"))?
                <div className="Table">
                <br/>
                <h1>Create a New Course</h1>
                <hr/>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>Course's Title</Form.Label>
                                <Form.Control type="text" onChange={e => setField('course_title', e.target.value)} placeholder="Enter the Course's Title"/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formDepartment">
                                <Form.Label>Instructor's ID</Form.Label>
                                <Form.Control type="text" onChange={e => setField('instructor_id', e.target.value)} placeholder="Enter the Instructor's ID"/>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                <Button type="submit" onClick={handleSubmit}>Submit</Button>
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