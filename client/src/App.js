import "./App.css";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginScreen from "./authenticationPage/login";
import StudentHome from "./user/home";
import StudentNavbar from "./user/components/navBar";
import AdminNavbar from "./admin/components/navBar";
import { Layout } from "antd";
import { AuthContext } from "./context/Auth.context";
import ax from "./conf/ax";
import Profile from "./user/profilePage";
import AdminHomePage from "./admin/home";
import AdminProfile from "./admin/profilePage";
import AdminScoreReport from "./admin/adminReport/adminScoreReport";
import ReportScore from "./user/reportPage/reportScore";
import Dashboard from "./admin/dashboard";
import AdminDashBoard from "./admin/adminReport/adminDashboard";

const { Sider, Content } = Layout;

axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";

const App = () => {
  const { state } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [nav, setNav] = useState(null);
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state.isLoggedIn) {
      const fetchRole = async () => {
        try {
          const result = await ax.get("users/me?populate=role");
          const role = result.data.role.type;
          setUserRole(role);
          if (role === "student") {
            setNav(<StudentNavbar />);
            setHome("/student-home");
          } else if (role === "professor") {
            setNav(<AdminNavbar />);
            setHome("/admin-home");
          } else {
            setUserRole(null);
          }
        } catch (error) {
          console.error("Error fetching role:", error);
          setUserRole(null);
        } finally {
          setLoading(false);
        }
      };

      fetchRole();
    } else {
      setLoading(false);
    }
  }, [state.isLoggedIn]);

  if (loading) return <div>Loading...</div>;
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        {state.isLoggedIn && (
          <Sider
            style={{
              position: "fixed",
              height: "100vh",
              backgroundColor: "#001529",
            }}
          >
            {nav}
          </Sider>
        )}
        <Layout style={{ marginLeft: state.isLoggedIn ? 200 : 0 }}>
          <Content style={{ padding: "20px" }}>
            <Routes>
              <Route path="" element={<Navigate to="/login" />} />
              <Route
                path="/login"
                element={
                  state.isLoggedIn ? <Navigate to={home} /> : <LoginScreen />
                }
              />
              {/* Student page */}
              <Route
                path="/student-home"
                element={
                  state.isLoggedIn && userRole === "student" ? (
                    <StudentHome />
                  ) : (
                    <Navigate to={home || "/login"} />
                  )
                }
              />
              <Route
                path="/student-home/:courseId"
                element={
                  state.isLoggedIn && userRole === "student" ? (
                    <ReportScore />
                  ) : (
                    <Navigate to={home || "/login"} />
                  )
                }
              />
              <Route
                path="/student-home/profile"
                element={
                  state.isLoggedIn && userRole === "student" ? (
                    <Profile />
                  ) : (
                    <Navigate to={home || "/login"} />
                  )
                }
              />
              {/* Admin page */}
              <Route
                path="/admin-home"
                element={
                  state.isLoggedIn && userRole === "professor" ? (
                    <AdminHomePage />
                  ) : (
                    <Navigate to={home || "/login"} />
                  )
                }
              />
              <Route
                path="/admin-home/:courseId"
                element={
                  state.isLoggedIn && userRole === "professor" ? (
                    <AdminScoreReport />
                  ) : (
                    <Navigate to={home || "/login"} />
                  )
                }
              />
              <Route
                path="/admin-home/profile"
                element={
                  state.isLoggedIn && userRole === "professor" ? (
                    <AdminProfile />
                  ) : (
                    <Navigate to={home || "/login"} />
                  )
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  state.isLoggedIn && userRole === "professor" ? (
                    <Dashboard />
                  ) : (
                    <Navigate to={home || "/login"} />
                  )
                }
              />
              <Route
                path="/admin-dashboard/:courseId"
                element={
                  state.isLoggedIn && userRole === "professor" ? (
                    <AdminDashBoard />
                  ) : (
                    <Navigate to={home || "/login"} />
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
