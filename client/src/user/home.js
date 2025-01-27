import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag } from "antd";
import "./user.css";
import { useNavigate } from "react-router-dom";
import ax from "../conf/ax";

const Homepage = () => {
  const navigate = useNavigate();
  const [firstname, setFirstName] = useState(null);
  const [lastname, setLastName] = useState(null);
  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const result = await ax.get("users/me?populate=*");
        const courses = result.data.subjects;
        console.log(courses)
        const Firstname = result.data.firstname;
        const Lastname = result.data.lastname;
        // const uniqueCourses = courses.filter(
        //   (course, index, self) =>
        //     index === self.findIndex((c) => c.documentId === course.documentId)
        // );
        setCourseData(courses);
        setFirstName(Firstname);
        setLastName(Lastname);
      } catch (error) {
        console.error("Failed to fetch user name", error);
      }
    };
    fetchName();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>
        สวัสดีคุณ{firstname} {lastname}
      </h1>
      <Row gutter={[16, 16]} style={{ display: "flex", flexWrap: "wrap" }}>
        {courseData.map((course, index) => (
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
                backgroundColor: "#eaf8f8",
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

export default Homepage;
