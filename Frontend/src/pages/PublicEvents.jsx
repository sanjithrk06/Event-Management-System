import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Modal,
  Form,
  Input,
  message,
  Typography,
  Layout,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import axios from "axios";

const { Title } = Typography;
const { Header, Content } = Layout;

const PublicEvents = () => {
  const [events, setEvents] = useState([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Track login status
  const navigate = useNavigate();
  const { isAdmin, logout, user } = useAuthStore();

  if (user === null) navigate("/login");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/event/");
      setEvents(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("Failed to fetch events");
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setIsRegisterModalOpen(true);
  };

  const handleRegisterSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/registration",
        {
          eventId: selectedEvent._id,
          userName: values.name,
          userEmail: values.email,
        }
      );
      message.success("Successfully registered for the event!");
      setIsRegisterModalOpen(false);
    } catch (error) {
      console.error("Registration error:", error);
      message.error("Failed to register for the event.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#fff", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Title level={3} style={{ margin: 12 }}>
            Upcoming Events
          </Title>
          <div>
            {isAdmin && <Link className=" text-red-600" to="/dashboard">Dashboard</Link>}
            {isLoggedIn ? (
              <Button onClick={handleLogout} type="primary" danger>
                Logout
              </Button>
            ) : (
              <Button onClick={handleLogin} type="primary">
                Login
              </Button>
            )}
          </div>
        </div>
      </Header>

      <Content
        style={{ padding: "20px", display: "flex", justifyContent: "center" }}
      >
        <div
          style={{
            width: "80%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Row gutter={[16, 16]} justify="center" style={{ width: "100%" }}>
            {events.map((event) => (
              <Col
                span={8}
                key={event._id}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  title={event.name}
                  bordered={false}
                  style={{ width: "100%", textAlign: "start" }}
                  extra={
                    <Button onClick={() => handleRegister(event)}>
                      Register
                    </Button>
                  }
                >
                  <div className=" flex flex-row gap-3">
                    <label className=" font-medium">Description: </label>
                    <p>{event.description}</p>
                  </div>
                  <div className=" flex flex-row gap-3">
                    <label className=" font-medium">Date:</label>
                    <p>{new Date(event.date).toDateString()}</p>
                  </div>
                  <div className=" flex flex-row gap-3">
                    <label className=" font-medium">Location:</label>
                    <p>{event.location}</p>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>

      <Modal
        title={`Register for ${selectedEvent?.name}`}
        visible={isRegisterModalOpen}
        onCancel={() => setIsRegisterModalOpen(false)}
        footer={null}
      >
        <Form onFinish={handleRegisterSubmit} layout="vertical">
          <Form.Item
            label="Your Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item
            label="Your Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form>
      </Modal>
    </Layout>
  );
};

export default PublicEvents;
