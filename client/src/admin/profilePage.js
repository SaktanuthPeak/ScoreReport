//About.js
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Layout, Avatar, Button, Card, Row, Col, Typography, Spin, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import EditProfile from "./components/editProfile";
import ax from "../conf/ax";

const { Content } = Layout;
const { Title, Text } = Typography;

const AdminProfile = () => {
    const [user, setUser] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const openForm = () => {
        setOpenEdit(true);
    };

    const closeForm = () => {
        setOpenEdit(false);
    };

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            const response = await ax.get("users/me");
            setUser(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleEditItem = async (item) => {
        try {
            setIsLoading(true);
            const response = await ax.put("user/me", item);
            fetchItems();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !user) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Layout>
            <Content style={{ margin: "24px", padding: "24px" }}>
                <Card style={{ maxWidth: 600, margin: "0 auto" }}>
                    <Row gutter={[16, 16]} justify="center" align="middle">
                        <Col span={24} style={{ textAlign: "center" }}>
                            <Avatar size={128} icon={<UserOutlined />} />
                            <Title level={3} style={{ marginTop: 16 }}>
                                {user.firstname} {user.lastname}
                            </Title>
                            <Text type="secondary">Username: {user.username}</Text>
                        </Col>

                        <Col span={24}>
                            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                                <Text>
                                    <b>Email:</b> {user.email}
                                </Text>
                                <Text>
                                    <b>Account Created:</b> {dayjs(user.createdAt).format("DD/MM/YYYY")}
                                </Text>

                            </Space>
                        </Col>

                        <Col span={24} style={{ textAlign: "center" }}>
                            <Button type="primary" onClick={openForm}>
                                Edit Profile
                            </Button>
                        </Col>
                    </Row>
                </Card>

                {openEdit && (
                    <EditProfile
                        defaultValue={user}
                        closeForm={closeForm}
                        onSubmit={handleEditItem}
                    />
                )}
            </Content>
        </Layout>
    );
};

export default AdminProfile;
