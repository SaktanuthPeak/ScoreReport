import React, { useEffect, useState } from "react";
import { Table, Card } from "antd";
import ax from "../conf/ax";
import ShowReport from "./components/showReport";
const AdminWebDevReport = () => {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        // const userResult = await ax.get("/users?populate=role");
        // const userData = userResult.data;
        // console.log(userData);

        // const filterStudents = userData.filter(
        //   (user) => user.role.type === "student"
        // );
        // setStudnet(filterStudents);

        const studentScore = await ax.get("/scores");
        const studentData = studentScore.data.data;

        const filterStudents = studentData.filter(
          (user) => user.sID === "yqwnvt92d2zmu7sehv36akdf"
        );
        setStudent(filterStudents);
        console.log("22222222222222222222222222", student);
        console.log("-------------------", filterStudents);
        console.log("+++++++++++++++++++++", student);
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

  //   const mapstudent = student.map((item) => {
  //     console.log(item.username);
  //   });

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
      <h1>Web Development Report</h1>
      {loading ? (
        <h1>Loading scores...</h1>
      ) : (
        <div>
          <h1>Data loaded</h1>
          {student.map((item) => (
            <h2>{item.username}</h2>
          ))}
          <ShowReport data={transactionData} />
        </div>
      )}
    </div>
  );
};

export default AdminWebDevReport;
