import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography } from "antd";
import ax from "../../conf/ax";
import { useParams } from "react-router-dom";
import {
  BookOutlined,
  FileTextOutlined,
  CalendarOutlined,
  FormOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import WebdevUploadModal from "../components/uploadModal";
import ShowReportT from "../components/showReportT";

const { Title } = Typography;
const reportCards = [
  {
    title: "Quiz (20%)",
    description: "คลิกเพื่ออัปโหลดคะเเนน Quiz",
    color: "blue",
    icon: <BookOutlined />,
    scoreType: "Quiz",
  },
  {
    title: "Homework (20%)",
    description: "คลิกเพื่ออัปโหลดคะเเนน Homework",
    color: "green",
    icon: <FileTextOutlined />,
    scoreType: "Homework",
  },
  {
    title: "Midterm (30%)",
    description: "คลิกเพื่ออัปโหลดคะเเนน Midterm",
    color: "purple",
    icon: <CalendarOutlined />,
    scoreType: "Midterm",
  },
  {
    title: "Final (30%)",
    description: "คลิกเพื่ออัปโหลดคะเเนน Final",
    color: "red",
    icon: <FormOutlined />,
    scoreType: "Final",
  },
  {
    title: "All score (100%)",
    description: "คลิกเพื่ออัปโหลดทุกคะแนนคะเเนน",
    color: " #C70039 ",
    icon: <ProfileOutlined />,
    scoreType: "allScore",
  },
];
const AdminScoreReport = () => {
  const [student, setStudent] = useState([]);
  const [courseData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentScoreType, setCurrentScoreType] = useState("");

  const { courseId } = useParams();
  const fetchStudent = async () => {
    try {
      const courseData = await ax.get(`/subjects/${courseId}?populate=*`);
      const studentData = courseData.data.data.scores;
      setCoursesData(courseData.data.data);
      setStudent(studentData);

      setTransactionData(
        studentData
          .map((row) => ({
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
        <Title level={2}>{courseData.title}</Title>
        <Title level={4} style={{ color: "#666" }}>
          {courseData.IDsubject}
        </Title>
      </div>
      <Row
        gutter={[16, 16]}
        style={{
          paddingBottom: "1rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {reportCards.map((card) => (
          <Col key={card.title}>
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
                  color: card.color,
                  borderRadius: "50%",
                  width: "13.2rem",
                  height: "5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.5rem",
                  fontSize: "3rem",
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
        <ShowReportT data={transactionData} />
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

export default AdminScoreReport;
