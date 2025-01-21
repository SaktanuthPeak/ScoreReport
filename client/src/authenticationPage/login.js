import React, { useContext } from 'react';
import { Form, Input, Button, Alert, Spin } from 'antd';
import { AuthContext } from '../context/Auth.context.js';



const LoginForm = () => {
    const { state: ContextState, login } = useContext(AuthContext);
    const { isLoginPending, isLoggedIn, loginError } = ContextState;

    const [form] = Form.useForm(); // ใช้สำหรับควบคุม Form ของ AntD

    const onSubmit = (values) => {
        const { username, password } = values;
        login(username, password);
        form.resetFields(); // รีเซ็ตค่าในฟอร์มหลังจากส่งข้อมูล
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <Form
                form={form}
                name="loginForm"
                onFinish={onSubmit}
                layout="vertical"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        { required: true, message: 'Please enter your username' },
                    ]}
                >
                    <Input placeholder="admin" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please enter your password' },
                    ]}
                >
                    <Input.Password placeholder="admin" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" >
                        Login
                    </Button>
                </Form.Item>
            </Form>

            {/* {isLoginPending && (
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Spin tip="Please wait..." />
                </div>
            )} */}
            {isLoggedIn && (
                <Alert
                    message="Success"
                    description="You have successfully logged in."
                    type="success"
                    showIcon
                    style={{ marginTop: '10px' }}
                />
            )}
            {loginError && (
                <Alert
                    message="Login Error"
                    description={loginError.message}
                    type="error"
                    showIcon
                    style={{ marginTop: '10px' }}
                />
            )}
        </div>
    );
};

export default LoginForm;
