import './App.css';
import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './authenticationPage/login';
import StudentHome from './user/home';
import StudentNavbar from './user/components/navBar';
import AdminNavbar from './admin/components/navBar';
import { Layout } from 'antd';
import { AuthContext } from './context/Auth.context';
import ax from './conf/ax';
import Profile from './user/profilePage';
import WebDevReport from './user/webDevReport';
import AdminHomePage from './admin/home';
import AdminWebDevReport from './admin/webDevReport';

const { Sider, Content } = Layout;

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:1337";

const App = () => {
  const { state } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [nav, setNav] = useState(null);
  const [home, setHome] = useState(null);

  useEffect(() => {
    if (state.isLoggedIn) {
      const fetchRole = async () => {
        try {
          const result = await ax.get('users/me?populate=role');
          const role = result.data.role.type;
          setUserRole(role);

          if (role === "student") {
            setNav(<StudentNavbar />);
            setHome('/student-home');
          } else {
            setNav(<AdminNavbar />);
            setHome('/admin-home');
          }
        } catch (error) {
          console.error('Error fetching role:', error);
        }
      };

      fetchRole();
    }
  }, [state.isLoggedIn]);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {state.isLoggedIn && (
          <Sider style={{ position: 'fixed', height: '100vh', backgroundColor: '#001529' }}>
            {nav}
          </Sider>
        )}
        <Layout style={{ marginLeft: state.isLoggedIn ? 200 : 0 }}>
          <Content style={{ padding: '20px' }}>
            <Routes>
              <Route
                path="/login"
                element={
                  state.isLoggedIn ? (
                    <Navigate to={home} />
                  ) : (
                    <LoginScreen />
                  )
                }
              />
              <Route
                path="/student-home"
                element={
                  state.isLoggedIn ? (
                    <StudentHome />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/student-home/profile"
                element={
                  state.isLoggedIn ? (
                    <Profile />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/student-home/web-development"
                element={
                  state.isLoggedIn ? (
                    <WebDevReport />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              {/* admin page */}
              <Route
                path="/admin-home"
                element={
                  state.isLoggedIn ? (
                    <AdminHomePage />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/admin-home/web-development"
                element={
                  state.isLoggedIn ? (
                    <AdminWebDevReport />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
