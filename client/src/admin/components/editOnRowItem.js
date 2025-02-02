import { useEffect } from "react";
import { Button, Form, Input, InputNumber, Modal } from "antd";

const EditOnRowItem = ({ defaultValue, onSubmit, closeModal }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      id: defaultValue.id,
      key: defaultValue.id,
      UID: defaultValue.UID,
      Quiz1: defaultValue.Quiz1,
      homeworkScore: defaultValue.homeworkScore,
      MidtermScore: defaultValue.MidtermScore,
      FinalScore: defaultValue.FinalScore,
    });
  }, [defaultValue]);

  const handleSumbit = () => {
    form.validateFields().then((values) => {
      const updatedValue = {
        ...defaultValue,
        ...values,
      };

      onSubmit(updatedValue);
      closeModal();
    });
  };

  return (
    <Modal
      title="เเก้ไขคะเเนน"
      open={true}
      onCancel={closeModal}
      footer={[
        <Button key="cancel" onClick={closeModal}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSumbit}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="horizon">
        <Form.Item name="UID" label="UID" rules={[{ required: true }]}>
          <Input placeholder="UID" disabled />
        </Form.Item>
        <Form.Item
          name="Quiz1"
          label="Quiz Score"
          rrules={[
            { required: true },
            { type: "number", message: "Please enter a valid number!" },
          ]}
        >
          <InputNumber placeholder="Quiz1" type="number" min={0} max={20} />
        </Form.Item>
        <Form.Item
          name="homeworkScore"
          label="Homework Score"
          rules={[
            { required: true },
            { type: "number", message: "Please enter a valid number!" },
          ]}
        >
          <InputNumber
            placeholder="homeworkScore"
            type="number"
            min={0}
            max={20}
          />
        </Form.Item>
        <Form.Item
          name="MidtermScore"
          label="Midterm Score"
          rules={[
            { required: true },
            { type: "number", message: "Please enter a valid number!" },
          ]}
        >
          <InputNumber
            placeholder="MidtermScore"
            type="number"
            min={0}
            max={30}
          />
        </Form.Item>
        <Form.Item
          name="FinalScore"
          label="Final Score"
          rules={[
            { required: true },
            { type: "number", message: "Please enter a valid number!" },
          ]}
        >
          <InputNumber
            placeholder="FinalScore"
            type="number"
            min={0}
            max={30}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditOnRowItem;
