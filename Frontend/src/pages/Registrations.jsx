import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Space,
  Table,
  Typography,
  Modal,
  Form,
  message,
} from "antd";
import { EyeOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const Registrations = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/registration/"
      );
      const registrationsWithKeys = response.data.data.map((registration) => ({
        ...registration,
        key: registration._id,
      }));

      setData(registrationsWithKeys);
      setFilteredData(registrationsWithKeys);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("Failed to fetch registrations");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Event Name",
      dataIndex: ["eventId", "name"],
      key: "eventName",
      render: (_, record) => record.eventId?.name || "Unknown",
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "User Email",
      dataIndex: "userEmail",
      key: "userEmail",
    },
    {
      title: "Registered At",
      dataIndex: "registeredAt",
      key: "registeredAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    const filteredResults = data.filter(
      (item) =>
        item.userName.toLowerCase().includes(value) ||
        item.userEmail.toLowerCase().includes(value) ||
        item.eventId?.name?.toLowerCase().includes(value)
    );
    setFilteredData(filteredResults);
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5001/api/registration/${selectedRecord._id}`
      );
      await fetchRegistrations();
      setIsDeleteModalOpen(false);
      message.success("Registration deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete registration");
    }
  };

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
        className="flex flex-col items-start sm:flex-row"
      >
        <Title align="start" level={3} style={{ margin: 0 }}>
          Registrations
        </Title>
      </Space>

      <Input
        placeholder="Search registrations..."
        prefix={<SearchOutlined />}
        onChange={handleSearch}
        style={{ marginBottom: 16, maxWidth: 400 }}
      />

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{
          pageSize: pageSize,
          onChange: (_, size) => setPageSize(size),
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
        }}
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      {/* View Modal */}
      <Modal
        title="Registration Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedRecord && (
          <div>
            <p>
              <strong>Event Name:</strong>{" "}
              {selectedRecord.eventId?.name || "Unknown"}
            </p>
            <p>
              <strong>User Name:</strong> {selectedRecord.userName}
            </p>
            <p>
              <strong>User Email:</strong> {selectedRecord.userEmail}
            </p>
            <p>
              <strong>Registered At:</strong>{" "}
              {new Date(selectedRecord.registeredAt).toLocaleString()}
            </p>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={confirmDelete}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this registration?</p>
      </Modal>
    </div>
  );
};

export default Registrations;
