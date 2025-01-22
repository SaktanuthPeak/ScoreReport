import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag } from "antd";
import './user.css'
import { Navigate, useNavigate } from "react-router-dom";
import ax from "../conf/ax";


const courses = [
    {
        code: "240-123",
        title: "DATA STRU, ALGOR & PRO MODULE",
        section: "02",
        credit: 6,
        key: "data-structure-algo"
    },
    {
        code: "240-124",
        title: "WEB DESIGN & DEVELOPER MODULE",
        section: "02",
        credit: 9,
        key: "web-development"
    },
    {
        code: "890-104G1",
        title: "ENGLISH IN THE DIGITAL WORLD",
        section: "14",
        credit: 2,
        key: "english"
    },
];

const Homepage = () => {
    const [name, setName] = useState(null)
    useEffect(() => {
        const fetchName = async () => {
            const result = await ax.get('users/me')
            const username = result.data.username
            setName(username)
        }
        fetchName()
    }, [])
    const navigate = useNavigate();
    const handleCardClick = (coursekey) => {
        navigate(`/student-home/${coursekey}`)
    }

    return (
        <div style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
            <h1>
                Hello {name}
            </h1>
            <Row gutter={[16, 16]}>
                {courses.map((course, index) => (
                    <Col xs={24} sm={24} md={12} lg={8} key={index}>
                        <Card className="custom-card"
                            style={{
                                backgroundColor: "#eaf8f8",
                                borderRadius: "10px",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                cursor: "pointer"
                            }}
                            onClick={() => handleCardClick(course.key)}

                        >
                            <h3 style={{ margin: 0 }}>{course.code}</h3>
                            <p style={{ margin: "8px 0", fontWeight: "bold" }}>{course.title}</p>
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
