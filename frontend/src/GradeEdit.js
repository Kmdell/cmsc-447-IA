import React from "react";
import './App.css';
import {useParams, useNavigate} from 'react-router-dom'
import {Button, Row, Col, Form, Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function New() {
    const navigate = useNavigate();
    const [form, setForm] = React.useState({});
    const { course_id, student_id } = useParams();
    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    function handleRedirect(endpoint, id0, id1) {
        navigate('/' + endpoint + "/edit/" + id0 + "/" + id1)
    }

    React.useEffect(() => {
        async function fetchData() {
            await delay(100)  
            await fetch("http://127.0.0.1:5000/grade/" + course_id + "/" + student_id, {method: "GET"})
                .then((res) => res.json())
                .then((data) => setForm(data[0]));
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
            fetch('http://127.0.0.1:5000/grade/' + course_id + '/' + student_id, reqOptions)
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
            <div className="Table">
                <br/>
                <h1>Edit Grade</h1>
                <hr/>
                <Form>
                    <Row>
                    <Form.Control type="text" onChange={e => setField('grade', e.target.value)} defaultValue={form.grade} placeholder="Enter the Student's Grade"/>
                    </Row>
                </Form>
                <Button type="submit" onClick={handleSubmit}>Submit</Button>
            </div>
        </>   
    )
}

export default New;