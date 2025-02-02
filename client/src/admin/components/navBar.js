import { Outlet, Link } from "react-router-dom";
import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  UserOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";

const { Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const AdminNavbar = () => {
  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  const items = [
    getItem(
      <Link to="/admin-home">
        <UserOutlined style={{ marginRight: "10px" }} />
        home
      </Link>
    ),
    getItem(
      <Link to="/admin-dashboard">
        <DesktopOutlined style={{ marginRight: "10px" }} />
        Dashboard
      </Link>,
      <FileOutlined />
    ),
    getItem(
      <Link to="/admin-home/profile">
        <UserOutlined style={{ marginRight: "10px" }} />
        Teacher Profile
      </Link>
    ),

    getItem(
      <Link to="/" onClick={logout}>
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

export default AdminNavbar;
