import React from "react";
import './App.css';
import {Button, Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [instructors, setInstructors] = React.useState(null)
  const [students, setStudents] = React.useState(null)
  const [courses, setCourses] = React.useState(null)

  React.useEffect(() => {
    async function fetchData() {
      await fetch("http://127.0.0.1:5000/instructor", {method: "GET"})
      .then((res) => res.json())
      .then((data) => setInstructors(data));

      await fetch("http://127.0.0.1:5000/student", {method: "GET"})
        .then((res) => res.json())
        .then((data) => setStudents(data));

      await fetch("http://127.0.0.1:5000/course", {method: "GET"})
        .then((res) => res.json())
        .then((data) => setCourses(data));
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="Table">
        <br/>
        <h1>Instructors</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Instructor ID</th>
              <th>Name</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {instructors == null?
            <tr>
              <td colSpan={5}>Loading...</td>
            </tr>
            :
            instructors.map((info) => {
              return(<tr>
                <td>{info.instructor_id}</td>
                <td>{info.name}</td>
                <td>{info.department}</td>
              </tr>)
            })}
          </tbody>
        </Table>
        <Button variant="primary" href="/instructor/new" style={{justifyContent:'right'}}>Create New</Button>
        <hr/>
        <br/>
        <h1>Students</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Credits Earned</th>
            </tr>
          </thead>
          <tbody>
            {students == null?
            <tr>
              <td colSpan={5}>Loading...</td>
            </tr>
            :
            students.map((info) => {
              return(<tr>
                <td>{info.student_id}</td>
                <td>{info.name}</td>
                <td>{info.credits_earned}</td>
              </tr>)
            })}
          </tbody>
        </Table>
        <Button variant="primary" href="/student/new" style={{justifyContent:'right'}}>Create New</Button>
        <hr/>
        <br/>
        <h1>Courses</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Title</th>
              <th>Instructor ID</th>
            </tr>
          </thead>
          <tbody>
            {courses == null?
            <tr>
              <td colSpan={5}>Loading...</td>
            </tr>
            :
            students.map((info) => {
              return(<tr>
                <td>{info.course_id}</td>
                <td>{info.course_title}</td>
                <td>{info.instructor_id}</td>
              </tr>)
            })}
          </tbody>
        </Table>
        <Button variant="primary" href="/course/new" style={{justifyContent:'right'}}>Create New</Button>
      </div>
    </>
  );
}

export default App;