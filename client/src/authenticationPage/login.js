import React, { useContext } from 'react';
import { Form, Input, Button, Alert, Spin, Typography, Card } from 'antd';
import { AuthContext } from '../context/Auth.context.js';

const { Title } = Typography;

const LoginForm = () => {
    const { state: ContextState, login } = useContext(AuthContext);
    const { isLoginPending, isLoggedIn, loginError } = ContextState;

    const [form] = Form.useForm();

    const onSubmit = (values) => {
        const { username, password } = values;
        login(username, password);
        form.resetFields();
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <Card style={{ maxWidth: '400px', width: '100%', padding: '20px' }}>
                <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>Score Report</Title>

                <Form
                    form={form}
                    name="loginForm"
                    onFinish={onSubmit}
                    layout="vertical"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please enter your username' }]}
                    >
                        <Input placeholder="Enter your username" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>


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
            </Card>
        </div>
    );
};

export default LoginForm;
