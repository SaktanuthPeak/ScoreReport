import { Card, Row, Col, Typography, Button } from "antd";
import {
  BookOutlined,
  FileTextOutlined,
  CalendarOutlined,
  FormOutlined,
} from "@ant-design/icons";
import "./admin.css";
import ShowReport from "./components/showReport";
import ax from "../conf/ax";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
const { Title } = Typography;

const AdminWebDevReport = () => {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState([]);

  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);

  const reportCards = [
    {
      title: "Quiz (20%)",
      description: "กรอกคะเเนนควิส",
      color: "blue",
      icon: <BookOutlined />,
      route: "/admin-home/web-development/quiz-input",
    },
    {
      title: "Homework (20%)",
      description: "กรอกคะเเนนการบ้าน",
      color: "green",
      icon: <FileTextOutlined />,
      route: "/admin-home/web-development/homework-input",
    },
    {
      title: "Midterm (30%)",
      description: "กรอกคะเเนนสอบกลางภาค",
      color: "purple",
      icon: <CalendarOutlined />,
      route: "/admin-home/web-development/midterm-input",
    },
    {
      title: "Final (30%)",
      description: "กรอกคะเเนนสอบปลายภาค",
      color: "red",
      icon: <FormOutlined />,
      route: "/admin-home/web-development/final-input",
    },
  ];

  const handleCardClick = (route) => {
    window.location.href = route;
  };

  const handleFile = (e) => {
    const fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        const reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("File dosent correct");
        setExcelFile(null);
      }
    } else {
      console.log("Select File");
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workBook = XLSX.read(excelFile, { type: "buffer" });
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      const data = XLSX.utils.sheet_to_json(workSheet);
      setExcelData(data.slice(0, 10));
    }
  };
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentScore = await ax.get("/scores?pagination[limit]=100");
        const studentData = studentScore.data.data;
        console.log(studentData);
        const filterStudents = studentData.filter(
          (user) => user.sID === "240-124"
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
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <div className="wrapper">
        <h1>put excel and show excel</h1>

        {/* form */}
        <form className="form-group custom-form" onSubmit={handleFileSubmit}>
          <input
            type="file"
            className="form-control"
            required
            onChange={handleFile}
          ></input>
          <button type="summit" className="btn btn-success btn-md">
            UPLOAD
          </button>
        </form>

        {/* view data */}
        <div className="viewer">
          {excelData ? (
            <div>
              <table>
                <thead>
                  <tr>
                    {Object.keys(excelData[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.map((individualExcelData, index) => (
                    <tr key={index}>
                      {Object.keys(individualExcelData).map((key) => (
                        <td key={key}>{individualExcelData[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>Data didnt load</div>
          )}
        </div>
      </div>
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
              onClick={() => handleCardClick(card.route)}
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
    </div>
  );
};

export default AdminWebDevReport;
