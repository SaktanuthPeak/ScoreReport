import { useEffect, useState } from 'react';
import { Button, Form, Input, Alert, Checkbox } from 'antd';
import axios from 'axios'
const URL_AUTH = "/api/auth/local"

export default function LoginScreen(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');
        if (savedUsername && savedPassword) {
            setUsername(savedUsername);
            setPassword(savedPassword);
            setRememberMe(true);

        }
    }, [])
    const handleLogin = async (formData) => {
        try {
            setIsLoading(true)
            setErrMsg(null)
            const response = await axios.post(URL_AUTH, { ...formData })
            const token = response.data.jwt
            axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }


            if (rememberMe) {
                localStorage.setItem('username', formData.identifier);
                localStorage.setItem('password', formData.password);

            } else {
                localStorage.removeItem('username')
                localStorage.removeItem('password')

            }

            props.onLoginSuccess();
        } catch (err) {
            console.log(err)
            setErrMsg(err.message)
        } finally { setIsLoading(false) }
    }
    return (
        <div>
            <header className='App-header'>
                <Form
                    onFinish={handleLogin}
                    autoComplete="off">
                    {errMsg &&
                        <Form.Item>
                            <Alert message={errMsg} type="error" />
                        </Form.Item>
                    }
                    <Form.Item
                        label="Username"
                        name="identifier"
                        onChange={(e) => setUsername(e.target.value)}
                        rules={[{ required: true, }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        rules={[{ required: true },]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Checkbox
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        >
                            Remember Me
                        </Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit" loading={isLoading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </header>
        </div>

    )
}