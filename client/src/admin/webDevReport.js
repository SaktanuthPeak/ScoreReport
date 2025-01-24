import React, { useEffect, useState } from "react";
import { Table, Card } from "antd";
import ax from "../conf/ax";

const AdminWebDevReport = () => {
  const [student, setStudnet] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const userResult = await ax.get("/users?populate=role");
        const userData = userResult.data;
        console.log(userData);

        const filterStudents = userData.filter(
          (user) => user.role.type === "student"
        );
        setStudnet(filterStudents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching scores or user data:", error);
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);
  console.log("+++++++++++++++++++++++++", student);

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
        </div>
      )}
    </div>
  );
};

export default AdminWebDevReport;
