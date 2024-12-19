import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Avatar,
  Space,
  Row,
  Col,
  Button,
  Drawer,
  ConfigProvider,
  theme,
} from "antd";
import { adminNav as items } from "../constants";

const { Header, Content, Sider } = Layout;

const flattenMenuItems = (items) => {
  let flattened = {};

  const flatten = (items) => {
    items.forEach((item) => {
      if (item.path) {
        flattened[item.key] = item.path;
      }
      if (item.children) {
        flatten(item.children);
      }
    });
  };

  flatten(items);
  return flattened;
};

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const findKeyByPath = (pathname) => {
    const paths = flattenMenuItems(items);
    return (
      Object.keys(paths).find((key) => paths[key] === pathname) || "dashboard"
    );
  };

  const [current, setCurrent] = useState(findKeyByPath(location.pathname));

  const onClick = (e) => {
    setCurrent(e.key);
    const paths = flattenMenuItems(items);
    if (paths[e.key]) {
      navigate(paths[e.key]);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#f67009",
          colorInfo: "#f67009",
        },
      }}
    >
      <Layout className="h-screen" style={{ overflow: "hidden" }}>
        <Sider
          theme="light"
          breakpoint="lg"
          collapsedWidth="0"
          width="230"
          className="shadow-sm hidden lg:block"
        >
          <div className="p-4 text-center">
            <span className="text-xl font-medium tracking-tight text-primary">
              Event Management
            </span>
          </div>
          <Menu
            theme="light"
            onClick={onClick}
            selectedKeys={[current]}
            defaultOpenKeys={[location.pathname.split("/")[2]]}
            mode="inline"
            items={items}
          />
        </Sider>

        <Drawer
          title="One Trip"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
        >
          <Menu
            theme="light"
            onClick={(e) => {
              onClick(e);
              setDrawerVisible(false);
            }}
            selectedKeys={[current]}
            mode="inline"
            items={items}
          />
        </Drawer>

        <Layout>
          <Header
            className="px-4 flex items-center justify-between lg:justify-end"
            style={{
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={<MenuUnfoldOutlined />}
              className="lg:hidden"
              onClick={() => setDrawerVisible(true)}
            />
            <Row align="end" className="w-full lg:w-auto">
              <Col span={16} className="lg:flex mr-5">
                <Space
                  size="large"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Avatar icon={<UserOutlined />} />
                  <LogoutOutlined />
                </Space>
              </Col>
            </Row>
          </Header>

          {/* Content */}
          <Content className="mx-4 my-4 mb-0 custom-hide-scrollbar">
            <div
              className="p-4 md:p-8"
              style={{
                minHeight: 360,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default DashboardLayout;
