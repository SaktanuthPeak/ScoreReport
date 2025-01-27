import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Typography,
  Spin,
  Alert,
  Row,
  Col,
  Statistic,
} from "antd";
import { UserOutlined, MailOutlined, NumberOutlined } from "@ant-design/icons";
import ax from "../../conf/ax";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;

const getGrade = (totalScore) => {
  if (totalScore >= 80) return "A";
  if (totalScore >= 75) return "B+";
  if (totalScore >= 70) return "B";
  if (totalScore >= 65) return "C+";
  if (totalScore >= 60) return "C";
  if (totalScore >= 50) return "D";
  return "E";
};

const ReportScore = () => {
  const { courseId } = useParams();
  const [allScores, setAllScores] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScoresAndUser = async () => {
      try {
        const courseData = await ax.get(`/subjects/${courseId}`);
        const userResult = await ax.get("/users/me");
        const userData = userResult.data;

        const scoresResult = await ax.get(
          "/scores?populate=*&pagination[limit]=100"
        );
        const scoresData = scoresResult.data.data;

        const filteredScores = scoresData.filter(
          (score) =>
            score.users_permissions_user?.UID === userData.UID &&
            score.subject?.sID === courseData.data.data.sID
        );

        setCurrentUser(userData);
        setAllScores(filteredScores);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching scores or user data:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchScoresAndUser();
  }, []);

  const keyMapping = {
    Quiz1: "Quiz (20 %)",
    homeworkScore: "Homework (20 %)",
    MidtermScore: "Midterm Exam (30 %)",
    FinalScore: "Final Exam (30 %)",
  };
  const sortOrder = ["Quiz1", "homeworkScore", "MidtermScore", "FinalScore"];
  const columns = [
    {
      title: "Category",
      dataIndex: "key",
      key: "key",
      render: (key) => <Text strong>{keyMapping[key] || key}</Text>,
    },
    {
      title: "Score (%)",
      dataIndex: "value",
      key: "value",
      render: (value) => <Text strong>{value}%</Text>,
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Loading scores..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Unable to fetch user scores"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div
      style={{
        padding: "24px",

        minHeight: "100vh",
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
        Data Structure Report
      </Title>

      {allScores.length > 0 ? (
        allScores.map((score, index) => {
          const scoreData = Object.keys(score)
            .filter((key) => typeof score[key] === "number" && key !== "id")
            .map((key) => ({
              key,
              value: score[key],
            }))
            .sort(
              (a, b) => sortOrder.indexOf(a.key) - sortOrder.indexOf(b.key)
            );

          const totalScore = scoreData.reduce(
            (sum, item) => sum + item.value,
            0
          );
          const grade = getGrade(totalScore);

          return (
            <Card
              key={index}
              title={
                <div>
                  <UserOutlined style={{ marginRight: 8 }} />
                  {`คุณ${currentUser.firstname} ${currentUser.lastname}`}
                </div>
              }
              extra={
                <Statistic
                  value={`Total Score : ${totalScore}% ( ${grade} )`}
                  suffix=""
                />
              }
              style={{
                marginBottom: "24px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>
                    <MailOutlined style={{ marginRight: 8 }} />
                    Email:
                  </Text>
                  <Text>{score.users_permissions_user.email}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>
                    <NumberOutlined style={{ marginRight: 8 }} />
                    รหัสนักศึกษา:
                  </Text>
                  <Text>{currentUser.UID}</Text>
                </Col>
              </Row>

              <div style={{ marginTop: "24px" }}>
                <Title level={4}>Scores</Title>
                <Table
                  columns={columns}
                  dataSource={scoreData}
                  pagination={false}
                  bordered
                  size="middle"
                />
              </div>
            </Card>
          );
        })
      ) : (
        <Alert
          message="No Scores"
          description="No scores found for the current user."
          type="info"
          showIcon
        />
      )}
    </div>
  );
};

export default ReportScore;
