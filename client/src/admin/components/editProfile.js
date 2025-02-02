import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { Button, Form, Modal } from "antd";
import { Input } from "antd";

const EditProfile = ({ defaultValue, onSubmit, closeForm }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (defaultValue) {
      form.setFieldsValue({
        firstname: defaultValue.firstname,
        lastname: defaultValue.lastname,
        username: defaultValue.username,
        email: defaultValue.email,
      });
    }
  }, [defaultValue, form]);

  const handleSumbit = () => {
    form.validateFields().then((values) => {
      const updatedValue = {
        ...defaultValue,
        ...values,
      };
      onSubmit(updatedValue);
      closeForm();
    });
  };
  return (
    <div style={{ paddingLeft: "50px" }}>
      <Modal
        title="Edit Profile"
        open={true}
        onCancel={closeForm}
        footer={[
          <Button key="cancel" onClick={closeForm}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSumbit}>
            Submit
          </Button>,
        ]}
      >
        <Form
          layout="horizon"
          form={form}
          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item
            name="firstname"
            label="Firstname"
            rules={[{ required: true }]}
          >
            <Input placeholder="Firstname" />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Lastname"
            rules={[{ required: true }]}
          >
            <Input placeholder="Lastname" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input placeholder="Email" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditProfile;
