import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography } from 'antd';
import {
    BookOutlined,
    FileTextOutlined,
    CalendarOutlined,
    FormOutlined
} from '@ant-design/icons';
import "./admin.css"
import ShowReport from "./components/showReport";
import ax from "../conf/ax";

const { Title } = Typography;

const AdminDsaReport = () => {
    const [student, setStudent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transactionData, setTransactionData] = useState([]);

    const reportCards = [
        {
            title: 'Quiz (20%)',
            description: 'กรอกคะเเนนควิส',
            color: 'blue',
            icon: <BookOutlined />,
            route: '/admin-home/web-development/quiz-input'
        },
        {
            title: 'Homework (20%)',
            description: 'กรอกคะเเนนการบ้าน',
            color: 'green',
            icon: <FileTextOutlined />,
            route: '/admin-home/web-development/homework-input'
        },
        {
            title: 'Midterm (30%)',
            description: 'กรอกคะเเนนสอบกลางภาค',
            color: 'purple',
            icon: <CalendarOutlined />,
            route: '/admin-home/web-development/midterm-input'
        },
        {
            title: 'Final (30%)',
            description: 'กรอกคะเเนนสอบปลายภาค',
            color: 'red',
            icon: <FormOutlined />,
            route: '/admin-home/web-development/final-input'
        }
    ];

    const handleCardClick = (route) => {
        window.location.href = route;
    };
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const studentScore = await ax.get("/scores?pagination[limit]=100");
                const studentData = studentScore.data.data;
                console.log(studentData);
                const filterStudents = studentData.filter(
                    (user) => user.sID === "240-123"
                );

                console.log(filterStudents);
                setTransactionData(
                    filterStudents.map((row) => ({
                        id: row.id,
                        key: row.id,
                        UID: row.UID,
                        Quiz1: row.Quiz1,
                        homeworkScore: row.homeworkScore,
                        MidtermScore: row.MidtermScore,
                        FinalScore: row.FinalScore,
                    }))
                        .sort((a, b) => a.UID.localeCompare(b.UID))
                );

                setLoading(false);
            } catch (error) {
                console.error("Error fetching scores or user data:", error);
                setLoading(false);
            }
        };

        fetchStudent();
    }, []);

    return (
        <div style={{
            padding: "20px",
            backgroundColor: "#f0f2f5",
            minHeight: "100vh"
        }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Title level={2}>Data Structure and Algorithm Module</Title>
                <Title level={4} style={{ color: '#666' }}>240-123</Title>
            </div>

            <Row gutter={[16, 16]} style={{ paddingBottom: "1em" }}>
                {reportCards.map((card) => (
                    <Col key={card.title} xs={24} sm={12} lg={6}>
                        <Card
                            hoverable
                            onClick={() => handleCardClick(card.route)}
                            style={{
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s',
                                textAlign: 'center'
                            }}
                            bodyStyle={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '20px'
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: `${card.color}1a`,
                                    color: card.color,
                                    borderRadius: '50%',
                                    width: '80px',
                                    height: '80px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '15px',
                                    fontSize: '36px'
                                }}
                            >
                                {card.icon}
                            </div>
                            <h3 style={{
                                color: card.color,
                                marginBottom: '10px',
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}>
                                {card.title}
                            </h3>
                            <p style={{
                                color: '#666',
                                textAlign: 'center'
                            }}>
                                {card.description}
                            </p>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div>
                <ShowReport data={transactionData} />
            </div>
        </div>
    );
};

export default AdminDsaReport;