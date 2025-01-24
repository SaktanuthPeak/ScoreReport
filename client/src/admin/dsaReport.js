import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import {
    BookOutlined,
    FileTextOutlined,
    CalendarOutlined,
    FormOutlined
} from '@ant-design/icons';
import "./admin.css"

const { Title } = Typography;

const AdminDsaReport = () => {
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

            <Row gutter={[16, 16]}>
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
        </div>
    );
};

export default AdminDsaReport;