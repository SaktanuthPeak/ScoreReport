import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  message,
  Space,
  Layout,
  theme,
} from "antd";
import ax from "../../conf/ax";
import { useParams } from "react-router-dom";
import {
  BookOutlined,
  FileTextOutlined,
  CalendarOutlined,
  FormOutlined,
  ProfileOutlined,
  HomeFilled,
} from "@ant-design/icons";
import UploadModal from "../components/uploadModal";
import SearchBar from "../components/searchBar";
import ShowReportT from "../components/showReportT";
import { useNavigate } from "react-router-dom";
import EditOnRowItem from "../components/editOnRowItem";
const { Title } = Typography;

const reportCards = [
  {
    title: "Quiz (20%)",
    description: "Click to upload Quiz scores",
    color: "blue",
    icon: <BookOutlined />,
    scoreType: "Quiz",
  },
  {
    title: "Homework (20%)",
    description: "Click to upload Homework scores",
    color: "green",
    icon: <FileTextOutlined />,
    scoreType: "Homework",
  },
  {
    title: "Midterm (30%)",
    description: "Click to upload Midterm scores",
    color: "purple",
    icon: <CalendarOutlined />,
    scoreType: "Midterm",
  },
  {
    title: "Final (30%)",
    description: "Click to upload Final scores",
    color: "red",
    icon: <FormOutlined />,
    scoreType: "Final",
  },
  {
    title: "All Scores (100%)",
    description: "Click to upload all scores",
    color: "#C70039",
    icon: <ProfileOutlined />,
    scoreType: "allScore",
  },
];

const AdminScoreReport = () => {
  const [students, setStudents] = useState([]);
  const [courseData, setCourseData] = useState({});
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentScoreType, setCurrentScoreType] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userData, setUserData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [openEditForm, setOpenEditForm] = useState(false);
  const { token } = theme.useToken();
  const { courseId } = useParams();
  const navigate = useNavigate();

  const fetchStudentData = async () => {
    try {
      const courseResponse = await ax.get(`/subjects/${courseId}?populate=*`);
      const course = courseResponse.data.data;
      console.log("Course data:", course);
      setCourseData(course);

      const students = course.scores;
      setStudents(students);

      setTransactionData(
        students
          .map((student) => ({
            documentId: student.documentId,
            id: student.id,
            key: student.id,
            UID: student.UID,
            Quiz1: student.Quiz1,
            homeworkScore: student.homeworkScore,
            MidtermScore: student.MidtermScore,
            FinalScore: student.FinalScore,
          }))
          .sort((a, b) => a.UID.localeCompare(b.UID))
      );

      setLoading(false);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setLoading(false);
    }
  };

  const handleCardClick = (scoreType) => {
    setCurrentScoreType(scoreType);
    setModalVisible(true);
  };

  const handleSearchBarChange = (selectedOptions) => {
    const usernames = selectedOptions.map((option) => option.value);
    setSelectedUsers(usernames);
    console.log("Selected usernames updated:", usernames);
  };

  const fetchSelectedUsersData = async () => {
    if (selectedUsers.length === 0) {
      message.warning("No users selected.");
      return;
    }

    console.log("Submitting selected usernames:", selectedUsers);

    try {
      setLoading(true);
      setTransactionData(
        students
          .map((student) => ({
            documentId: student.documentId,
            id: student.id,
            key: student.id,
            UID: student.UID,
            Quiz1: student.Quiz1,
            homeworkScore: student.homeworkScore,
            MidtermScore: student.MidtermScore,
            FinalScore: student.FinalScore,
          }))
          .filter((student) => selectedUsers.includes(student.UID))
          .sort((a, b) => a.UID.localeCompare(b.UID))
      );
      message.success("User data fetched successfully!");
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const openForm = (record) => {
    setEditData(record);
    setOpenEditForm(true);
  };

  const closeForm = () => {
    setOpenEditForm(false);
  };

  const handleEditItem = async (item) => {
    try {
      setLoading(true);
      const payload = {};
      payload.Quiz1 = item.Quiz1;
      payload.homeworkScore = item.homeworkScore;
      payload.MidtermScore = item.MidtermScore;
      payload.FinalScore = item.FinalScore;
      console.log("++++++++++++++++++++", payload);
      const response = await ax.put(`/scores/${item.documentId}`, {
        data: payload,
      });
      fetchStudentData();
      const { id, attributes } = response.data.data;
      setTransactionData([
        ...transactionData,
        { id: id, key: id, ...attributes },
      ]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteChanged = (id, note) => {
    setTransactionData(
      transactionData.map((transaction) => {
        transaction.note = transaction.id === id ? note : transaction.note;
        return transaction;
      })
    );
  };
  return (
    <div style={{ padding: "20px", minHeight: "100vh" }}>
      <Button icon={<HomeFilled />} onClick={() => navigate("/admin-home")}>
        Back to home
      </Button>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Title level={2}>{courseData.title || "Loading..."}</Title>
        <Title level={4} style={{ color: "#666" }}>
          {courseData.Code || ""}
        </Title>
      </div>

      <Row gutter={[16, 16]} justify="center" style={{ paddingBottom: "1em" }}>
        {reportCards.map((card) => (
          <Col key={card.title}>
            <Card
              hoverable
              onClick={() => handleCardClick(card.scoreType)}
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.3s",
              }}
              bodyStyle={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
                width: "18em",
              }}
            >
              <div
                style={{
                  color: card.color,
                  fontSize: "3rem",
                  marginBottom: "1rem",
                }}
              >
                {card.icon}
              </div>
              <h3 style={{ color: card.color }}>{card.title}</h3>
              <p>{card.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <SearchBar onChange={handleSearchBarChange} courseId={courseId} />

        <Button
          type="primary"
          onClick={fetchSelectedUsersData}
          loading={loading}
        >
          Submit Selected Users
        </Button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <ShowReportT
          data={transactionData}
          loading={loading}
          onNoteChanged={handleNoteChanged}
          onRowEdit={openForm}
        />
        {openEditForm && (
          <EditOnRowItem
            onSubmit={handleEditItem}
            closeModal={closeForm}
            defaultValue={editData}
          />
        )}
      </div>

      <UploadModal
        student={students}
        course={courseData}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        title={`${currentScoreType}Scores`}
        scoreType={currentScoreType}
        fetchStudentCallback={fetchStudentData}
      />
    </div>
  );
};

export default AdminScoreReport;
