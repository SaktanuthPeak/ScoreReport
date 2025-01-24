import { Table, Space, Tag, Button } from "antd";
import dayjs from "dayjs";

export default function ShowReport(props) {
  const columns = [
    {
      title: "UID",
      dataIndex: "UID",
      key: "UID",
    },
    {
      title: "Quiz1",
      dataIndex: "Quiz1",
      key: "Quiz1",
    },
    {
      title: "Homework",
      dataIndex: "homeworkScore",
      key: "homeworkScore",
    },
    {
      title: "Midterm Score",
      dataIndex: "MidtermScore",
      key: "MidtermScore",
    },
    {
      title: "Final Score",
      dataIndex: "FinalScore",
      key: "FinalScore",
    },
    {
      title: "Action",
      key: "action",
      hidden: true,
      render: (transaction) => (
        <Space size="middle">
          <Button
            onClick={() => {
              props.onRowEdit(transaction);
            }}
          >
            edit
          </Button>
          <Button
            onClick={() => {
              props.onRowDeleted(transaction.id);
            }}
          >
            delete
          </Button>
        </Space>
      ),
    },
  ];
  return <Table dataSource={props.data} columns={columns} />;
}
