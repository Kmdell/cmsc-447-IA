import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './index.css';
import App from './App';
import New from './New'
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes basename={'/'}>
      <Route path='/' element={<App/>} />
      <Route path='/:endpoint/new' element={<New/>} /> 
      <Route path='/instructor/edit/:id' element={<App/>} />
      <Route path='/student/edit/:id' element={<App/>} />
      <Route path='/course/edit/:id' element={<App/>} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
