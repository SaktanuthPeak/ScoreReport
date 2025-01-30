import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag, Button } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import { SearchOutlined } from '@ant-design/icons';
import ax from "../conf/ax";
import SubjectSearchBar from "./components/subjectSearchBar";

const StudentHome = () => {
  const [firstname, setFirstName] = useState(null);
  const [lastname, setLastName] = useState(null);
  const [uid, setUid] = useState(null);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const subject = await ax.get("/subjects?populate=*");
        const titles = subject.data.data.map(item => item.title);
        console.log('subject list =>>>>>', titles)
        const subjectData = subject.data.data;
        setCourses(subjectData);
        setFilteredCourses(subjectData);
      } catch (error) {
        console.log("this is error", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchName = async () => {
      const result = await ax.get("users/me");
      const firstName = result.data.firstname;
      const lastName = result.data.lastname;
      const studentId = result.data.UID
      setFirstName(firstName);
      setLastName(lastName);
      setUid(studentId);
    };
    fetchName();
  }, []);

  const navigate = useNavigate();

  const handleSubjectChange = (selectedOptions) => {
    setSelectedSubject(selectedOptions);
  };

  const handleFilter = () => {
    setLoading(true);

    if (selectedSubject.length === 0) {
      setFilteredCourses(courses);
    } else {
      const selectedTitles = selectedSubject.map(option => option.value);
      const filtered = courses.filter(course =>
        selectedTitles.includes(course.title)
      );
      setFilteredCourses(filtered);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "30px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ marginBottom: "24px" }}>สวัสดีคุณ{firstname} {lastname}</h1>
        <h2 style={{ marginBottom: "24px" }}>รหัสนักศึกษา : {uid} </h2>

        <div style={{
          maxWidth: "800px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}>
          <div style={{ flex: 1 }}>
            <SubjectSearchBar onChange={handleSubjectChange} />
          </div>
          <Button
            icon={<SearchOutlined />}
            type="primary"
            onClick={handleFilter}
            loading={loading}
          >
            Search Subject
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredCourses.map((course, index) => (
          <Col
            xs={24}
            sm={24}
            md={8}
            key={index}
            style={{
              width: "100%",
              maxWidth: "33.33%",
              padding: "0 8px",
              marginBottom: "16px",
            }}
          >
            <Card
              className="custom-card"
              style={{
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                height: "100%",
              }}
              onClick={() => navigate(`/student-home/${course.documentId}`)}
            >
              <h3 style={{ margin: 0 }}>{course.code}</h3>
              <p style={{ margin: "8px 0", fontWeight: "bold" }}>
                {course.title}
              </p>
              <p style={{ margin: "8px 0" }}>Section: {course.section}</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <Tag color="blue">{course.credit} หน่วยกิต</Tag>
                <Tag color="gray">Credit</Tag>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default StudentHome;