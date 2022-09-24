import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './index.css';
import App from './App';
import New from './New';
import Edit from './Edit';
import GradeEdit from './GradeEdit';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes basename={'/'}>
      <Route path='/' element={<App/>} />
      <Route path='/:endpoint/new' element={<New/>} /> 
      <Route path='/:endpoint/edit/:id' element={<Edit/>} />
      <Route path='/grade/edit/:course_id/:student_id' element={<GradeEdit/>} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
