import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag, Flex, Select, Button } from "antd";
import ax from "../../conf/ax";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";

const selectValue = [
  {
    value: "Quiz1",
    label: "Quiz Score",
  },
  {
    value: "homeworkScore",
    label: "Homework Score",
  },
  {
    value: "MidtermScore",
    label: "Midterm Score",
  },
  {
    value: "FinalScore",
    label: "Final Score",
  },
  {
    value: "totalScore",
    label: "Total Score",
  },
];

const AdminDashBoard = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [scoreData, setScoreData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const scoreCounts = [0, 0, 0, 0, 0, 0, 0, 0];

  const totalScoreCount = scoreData.forEach(({ totalScore }) => {
    if (totalScore >= 80) return scoreCounts[0]++;
    if (totalScore >= 75) return scoreCounts[1]++;
    if (totalScore >= 70) return scoreCounts[2]++;
    if (totalScore >= 65) return scoreCounts[3]++;
    if (totalScore >= 60) return scoreCounts[4]++;
    if (totalScore >= 55) return scoreCounts[5]++;
    if (totalScore >= 50) return scoreCounts[6]++;
    return scoreCounts[7]++;
  });

  const fetchScores = async () => {
    try {
      const course = await ax.get(`/subjects/${courseId}?populate=*`);
      const coursesData = course.data.data;
      const scoresData = course.data.data.scores;
      const mappedData = scoresData.map((item) => {
        const totalScore =
          (item.FinalScore || 0) +
          (item.homeworkScore || 0) +
          (item.MidtermScore || 0) +
          (item.Quiz1 || 0);
        return { ...item, totalScore };
      });
      setCourseData(coursesData);
      setScoreData(mappedData);
      setLoading(false);
      console.log(mappedData);
    } catch (error) {
      console.log("This is error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);
  console.log(courseData);
  return (
    <div>
      <div>
        <h1>Dashboard</h1>
        <h2>{courseData.title}</h2>
        <div style={{ maxWidth: "800px" }}>
          <Flex gap={8} vertical>
            <Flex gap={15}>
              <Select
                placeholder="Outlined"
                style={{ flex: 1 }}
                defaultValue={"Total Score"}
                options={selectValue}
              />
              <Button type="primary" onClick={""} loading={loading}>
                Select
              </Button>
            </Flex>
          </Flex>
        </div>
      </div>
      <center>
        <div
          style={{
            width: "80em",
            padding: "2em",
            margin: "2em",
            backgroundColor: "white",
            borderRadius: "14px",
          }}
        >
          <Bar
            data={{
              labels: ["E", "D", "D+", "C", "C+", "B", "B+", "A"],
              datasets: [
                {
                  label: "Score Distribution",
                  data: scoreCounts.reverse(),
                  backgroundColor: [
                    "#C0392B",
                    "#E74C3C",
                    "#E67E22",
                    "#F39C12",
                    "#F1C40F",
                    "#3498DB",
                    "#27AE60",
                    "#2ECC71",
                  ],
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Graph Grade of Student",
                },
              },
            }}
          ></Bar>
        </div>
      </center>
    </div>
  );
};

export default AdminDashBoard;
