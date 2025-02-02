import React, { use, useEffect, useState } from "react";
import { Card, Row, Col, Tag, Flex, Select, Button } from "antd";
import ax from "../../conf/ax";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";

const selectValue = [
  { value: "Quiz1", label: "Quiz Score" },
  { value: "homeworkScore", label: "Homework Score" },
  { value: "MidtermScore", label: "Midterm Score" },
  { value: "FinalScore", label: "Final Score" },
  { value: "totalScore", label: "Total Score" },
];
const score20Label = [
  "0-2",
  "3-4",
  "5-6",
  "7-8",
  "9-10",
  "11-12",
  "13-14",
  "15-16",
  "17-18",
  "19-20",
];
const score30Label = [
  "0-3",
  "4-6",
  "7-9",
  "10-12",
  "13-15",
  "16-18",
  "19-21",
  "22-24",
  "25-27",
  "28-30",
];
const gradeLabels = ["E", "D", "D+", "C", "C+", "B", "B+", "A"];
const gradeColors = [
  "#C0392B",
  "#E74C3C",
  "#E67E22",
  "#F39C12",
  "#F1C40F",
  "#3498DB",
  "#27AE60",
  "#2ECC71",
];
const normalColor = [
  "#C0392B",
  "#E74C3C",
  "#E67E22",
  "#F39C12",
  "#F1C40F",
  "#2E86C1",
  "#3498DB",
  "#1ABC9C",
  "#27AE60",
  "#2ECC71",
];
const AdminDashBoard = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [scoreData, setScoreData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [selectedValue, setSelectedValue] = useState("totalScore");
  const [scoreCount, setScoreCount] = useState([]);
  const [labelData, setLabelData] = useState([]);
  const [graphColors, setGraphColors] = useState([]);

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

    } catch (error) {

      setLoading(false);
    }
  };

  const setGraph = (selectedValue) => {
    let counts = [];
    let labels = [];

    if (["Quiz1", "homeworkScore"].includes(selectedValue)) {
      counts = new Array(10).fill(0);
      labels = score20Label;
      scoreData.forEach(({ [selectedValue]: score = 0 }) => {
        let index = Math.min(Math.floor(score / 2), 9);
        counts[index]++;
      });
      setGraphColors(normalColor);
    } else if (["FinalScore", "MidtermScore"].includes(selectedValue)) {
      counts = new Array(10).fill(0);
      labels = score30Label;
      scoreData.forEach(({ [selectedValue]: score = 0 }) => {
        let index = Math.min(Math.floor(score / 3), 9);
        counts[index]++;
      });
      setGraphColors(normalColor);
    } else {
      counts = new Array(8).fill(0);
      labels = gradeLabels;
      scoreData.forEach(({ totalScore = 0 }) => {
        if (totalScore >= 80) counts[7]++;
        else if (totalScore >= 75) counts[6]++;
        else if (totalScore >= 70) counts[5]++;
        else if (totalScore >= 65) counts[4]++;
        else if (totalScore >= 60) counts[3]++;
        else if (totalScore >= 55) counts[2]++;
        else if (totalScore >= 50) counts[1]++;
        else counts[0]++;
      });
      setGraphColors(gradeColors);
    }

    setScoreCount(counts);
    setLabelData(labels);
  };

  useEffect(() => {
    fetchScores();
  }, []);

  useEffect(() => {
    setGraph(selectedValue);
  }, [selectedValue, scoreData]);

  const handleChange = (value) => {
    setSelectedValue(value);
  };

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
                onChange={handleChange}
              />
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
              labels: labelData,
              datasets: [
                {
                  label: "Score Distribution",
                  data: scoreCount.reverse(),
                  backgroundColor: graphColors,
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
