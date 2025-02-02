import { Outlet, Link } from "react-router-dom";
import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  ApiOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";
import { Avatar, Space } from "antd";
import { Breadcrumb, Flex, Layout, Menu, theme } from "antd";

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const StudentNavbar = () => {
  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const items = [
    getItem(
      <Link to="/student-home">
        <HomeOutlined style={{ marginRight: "10px" }} />
        Home
      </Link>
    ),
    getItem(
      <Link to="/student-home/profile">
        <UserOutlined style={{ marginRight: "10px" }} />
        Student Profile
      </Link>
    ),
    getItem(
      <Link to="/student-home/dashboard">
        <DesktopOutlined style={{ marginRight: "10px" }} />
        Dashboard
      </Link>,
      <FileOutlined />
    ),

    getItem(
      <Link to="/login" onClick={logout}>
        <ApiOutlined style={{ marginRight: "10px" }} />
        Logout
      </Link>
    ),
  ];

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {

        }}
        onCollapse={(collapsed, type) => {

        }}
        style={{ minHeight: "100vh" }}
      >
        <div
          className="demo-logo-vertical"
        // style={{ display: "flex", flexDirection: "row" }}
        />

        <Menu
          style={{ paddingTop: "20px" }}
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
    </Layout>
  );
};

export default StudentNavbar;
