import { Table, Space, Tag, Button } from "antd";
import dayjs from "dayjs";

export default function ShowReportT(props) {
  const columns = [
    {
      title: "UID",
      dataIndex: "UID",
      key: "UID",
    },
    {
      title: "ชื่อ",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "นามสกุล",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Quiz (20%)",
      dataIndex: "Quiz1",
      key: "Quiz1",
    },
    {
      title: "Homework (20%)",
      dataIndex: "homeworkScore",
      key: "homeworkScore",
    },
    {
      title: "Midterm Score (30%)",
      dataIndex: "MidtermScore",
      key: "MidtermScore",
    },
    {
      title: "Final Score (30%)",
      dataIndex: "FinalScore",
      key: "FinalScore",
    },
    {
      title: "Action",
      key: "action",
      hidden: false,
      render: (transaction) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              props.onRowEdit(transaction);
            }}
          >
            edit
          </Button>
        </Space>
      ),
    },
  ];
  return <Table dataSource={props.data} columns={columns} />;
}
