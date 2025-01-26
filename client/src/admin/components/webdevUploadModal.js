import React, { useState } from "react";
import { Modal, Button, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import ax from "../../conf/ax";

const { Dragger } = Upload;

const WebdevUploadModal = ({
  visible,
  onCancel,
  title,
  scoreType,
  fetchStudentCallback,
}) => {
  const [excelFile, setExcelFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const draggerProps = {
    name: "file",
    multiple: false,
    accept: ".xlsx,.xls,.csv",
    beforeUpload: (file) => {
      const fileTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];

      if (fileTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
        return false;
      } else {
        message.error("Invalid file type. Please upload an Excel file.");
        return Upload.LIST_IGNORE;
      }
    },
    onChange: (info) => {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleUpload = async () => {
    if (!excelFile) {
      message.error("Please select a file first");
      return;
    }

    setLoading(true);
    try {
      const workBook = XLSX.read(excelFile, { type: "buffer" });
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      const data = XLSX.utils.sheet_to_json(workSheet);

      console.log("Excel Data:", data);

      const updatePromises = data.map(async (studentData) => {
        console.log("Processing Student:", studentData);

        const payload = {};
        if (scoreType === "allScore") {
          payload.Quiz1 = studentData.Quiz1;
          payload.homeworkScore = studentData.homeworkScore;
          payload.MidtermScore = studentData.MidtermScore;
          payload.FinalScore = studentData.FinalScore;
        } else {
          switch (scoreType) {
            case "Quiz":
              payload.Quiz1 = studentData.Quiz1;
              break;
            case "Homework":
              payload.homeworkScore = studentData.homeworkScore;
              break;
            case "Midterm":
              payload.MidtermScore = studentData.MidtermScore;
              break;
            case "Final":
              payload.FinalScore = studentData.FinalScore;
              break;
          }
        }

        const username =
          studentData.username || studentData.UID || studentData.id;

        console.log("Searching for username:", username);

        try {
          const student = await ax.get(
            `/scores?filters[UID]=${username}&filters[sID]=240-124`
          );

          console.log("Student API Response:", student.data.data);

          if (student.data.data.length > 0) {
            const studentRecord = student.data.data[0];
            await ax.put(`/scores/${studentRecord.documentId}`, {
              data: payload,
            });
            return studentRecord;
          } else {
            console.warn(`No student found for username: ${username}`);
            return null;
          }
        } catch (error) {
          console.error(`Error fetching student for ${username}:`, error);
          return null;
        }
      });

      const results = await Promise.allSettled(updatePromises);

      const successCount = results.filter(
        (result) => result.status === "fulfilled" && result.value !== null
      ).length;

      if (successCount > 0) {
        message.success(`Successfully updated ${successCount} student records`);
        fetchStudentCallback();
        onCancel();
      } else {
        message.error("No student records were updated");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Failed to upload scores");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Upload ${title} `}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleUpload}
          disabled={!excelFile}
        >
          Upload
        </Button>,
      ]}
    >
      <Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for Excel files (.xlsx, .xls, .csv)
        </p>
      </Dragger>
    </Modal>
  );
};

export default WebdevUploadModal;
