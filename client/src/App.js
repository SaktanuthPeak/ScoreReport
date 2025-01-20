import './App.css';
import axios from 'axios'
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import LoginScreen from './authenticationPage/login';
import StudentHome from './user/home';
import StudentNavbar from './user/components/navBar';
import { Layout } from 'antd';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:1337"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);


  }
  const handleLogout = () => {
    setIsAuthenticated(false)
    console.log('User has logged out');
  }


  return (
    <BrowserRouter>
      <div>{isAuthenticated ? (<StudentNavbar />) : (<Navigate to="/login" />)}

      </div>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/student-home" />
            ) : (
              <LoginScreen onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/student-home"
          element={
            isAuthenticated ? (
              <StudentHome />
            ) : (
              <Navigate to="/login" />
            )
          }
        />





      </Routes>
    </BrowserRouter>




  );
}
export default App;