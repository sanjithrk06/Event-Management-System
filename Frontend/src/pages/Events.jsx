import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Space,
  Table,
  Typography,
  DatePicker,
  Modal,
  Form,
  Input as AntdInput,
  message,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const { Title } = Typography;

const Events = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/event/");
      const eventsWithKeys = response.data.data.map((event, index) => ({
        ...event,
        key: event._id,
        eno: event.eventId,
      }));

      setData(eventsWithKeys);
      setFilteredData(eventsWithKeys);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("Failed to fetch events");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Event Id",
      dataIndex: "eventId",
      key: "eventId",
      width: 100,
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toDateString(),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
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
        item.eno.toLowerCase().includes(value) ||
        item.name?.toLowerCase().includes(value) ||
        item.location?.toLowerCase().includes(value)
    );
    setFilteredData(filteredResults);
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      eventId: record.eventId,
      name: record.name,
      location: record.location,
      date: moment(record.date),
      description: record.description,
    });

    setIsEditModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5001/api/event/${selectedRecord._id}`
      );
      await fetchEvents();
      setIsDeleteModalOpen(false);
      message.success("Event deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete event");
    }
  };

  const handleEditSubmit = async (values) => {
    if (!moment(values.date).isValid()) {
      message.error("Invalid date format!");
      return;
    }

    try {
      await axios.put(`http://localhost:5001/api/event/${selectedRecord._id}`, {
        eventId: values.eventId,
        name: values.name,
        location: values.location,
        date: values.date.format("YYYY-MM-DD"),
        description: values.description,
      });
      await fetchEvents();
      setIsEditModalOpen(false);
      message.success("Event updated successfully");
    } catch (error) {
      console.error("Error updating event:", error);
      message.error("Failed to update event");
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
          Events
        </Title>
        <Button
          align="start"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/dashboard/addEvent")}
        >
          Add Event
        </Button>
      </Space>

      <Input
        placeholder="Search events..."
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
        title="Event Details"
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
              <strong>Name:</strong> {selectedRecord.name}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedRecord.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Location:</strong> {selectedRecord.location}
            </p>
            <p>
              <strong>Description:</strong> {selectedRecord.description}
            </p>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Event"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            label="Event ID"
            name="eventId"
            rules={[{ required: true, message: "Please input the Event ID!" }]}
          >
            <AntdInput />
          </Form.Item>
          <Form.Item
            label="Event Name"
            name="name"
            rules={[
              { required: true, message: "Please input the event name!" },
            ]}
          >
            <AntdInput />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please input the location!" }]}
          >
            <AntdInput />
          </Form.Item>
          <Form.Item
            label="Event Date"
            name="date"
            rules={[
              { required: true, message: "Please input the event date!" },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <AntdInput.TextArea rows={4} />
          </Form.Item>
        </Form>
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
        <p>Are you sure you want to delete this event?</p>
      </Modal>
    </div>
  );
};

export default Events;
