import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography } from "antd";
import ax from "../../conf/ax";
import {
  BookOutlined,
  FileTextOutlined,
  CalendarOutlined,
  FormOutlined,
} from "@ant-design/icons";
import WebdevUploadModal from "../components/webdevUploadModal";
import ShowReport from "../components/showReport";

const { Title } = Typography;
const AdminWebDevReport = () => {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentScoreType, setCurrentScoreType] = useState('');

  const reportCards = [
    {
      title: "Quiz (20%)",
      description: "คลิกเพื่ออัปโหลดคะเเนน Quiz",
      color: "blue",
      icon: <BookOutlined />,
      scoreType: 'Quiz',
    },
    {
      title: "Homework (20%)",
      description: "คลิกเพื่ออัปโหลดคะเเนน Homework",
      color: "green",
      icon: <FileTextOutlined />,
      scoreType: 'Homework',
    },
    {
      title: "Midterm (30%)",
      description: "คลิกเพื่ออัปโหลดคะเเนน Midterm",
      color: "purple",
      icon: <CalendarOutlined />,
      scoreType: 'Midterm',
    },
    {
      title: "Final (30%)",
      description: "คลิกเพื่ออัปโหลดคะเเนน Final",
      color: "red",
      icon: <FormOutlined />,
      scoreType: 'Final',
    },
  ];

  const fetchStudent = async () => {
    try {
      const studentScore = await ax.get("/scores?pagination[limit]=100");
      const studentData = studentScore.data.data;
      const filterStudents = studentData.filter(
        (user) => user.sID === "240-124"
      );
      const userResponse = await ax.get("/users");
      const userData = userResponse.data;
      console.log(userData)
      const userMap = userData.reduce((acc, user) => {
        acc[user.UID] = {
          firstname: user.firstname,
          lastname: user.lastname,
        };
        return acc;
      }, {});

      setStudent(filterStudents);

      setTransactionData(
        filterStudents
          .map((row) => ({
            id: row.id,
            key: row.id,
            UID: row.UID,
            firstname: userMap[row.UID]?.firstname || "Unknown",
            lastname: userMap[row.UID]?.lastname || "Unknown",
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

  const handleCardClick = (scoreType) => {
    setCurrentScoreType(scoreType);
    setModalVisible(true);
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  return (
    <div style={{ padding: "20px", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Title level={2}>Web Design & Developer Module</Title>
        <Title level={4} style={{ color: "#666" }}>
          240-124
        </Title>
      </div>
      <Row gutter={[16, 16]} style={{ paddingBottom: "1em" }}>
        {reportCards.map((card) => (
          <Col key={card.title} xs={24} sm={12} lg={6}>
            <Card
              hoverable
              onClick={() => handleCardClick(card.scoreType)}
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.3s",
                textAlign: "center",
              }}
              bodyStyle={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
              }}
            >
              <div
                style={{
                  backgroundColor: `${card.color}1a`,
                  color: card.color,
                  borderRadius: "50%",
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "15px",
                  fontSize: "36px",
                }}
              >
                {card.icon}
              </div>
              <h3
                style={{
                  color: card.color,
                  marginBottom: "10px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  color: "#666",
                  textAlign: "center",
                }}
              >
                {card.description}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
      <div>
        <ShowReport data={transactionData} />
      </div>

      <WebdevUploadModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        title={`${currentScoreType} Scores`}
        scoreType={currentScoreType}
        fetchStudentCallback={fetchStudent}
      />
    </div>
  );
};

export default AdminWebDevReport;