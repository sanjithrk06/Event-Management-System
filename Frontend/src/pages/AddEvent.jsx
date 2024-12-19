import React, { useState } from "react";
import { Button, Form, Input, Row, Col, message, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const AddEvent = () => {
  const { TextArea } = Input;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        eventId: values.eventId,
        location: values.location,
        date: values.date.format("YYYY-MM-DD"),
        name: values.name,
        description: values.description,
      };

      setIsSubmitting(true);

      const response = await axios.post(
        "http://localhost:5001/api/event/create",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Event created successfully!");

      navigate("/dashboard/events");
    } catch (error) {
      console.error("Error creating event:", error);
      message.error("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "0px" }} className="text-slate-900 font-medium">
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className="flex flex-col px-2">
          <h1 className="font-bold text-2xl text-gray-800">Add Event</h1>
        </div>
        <div className="flex gap-3">
          <Button size="medium" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="medium"
            icon={<PlusOutlined />}
            onClick={() => form.submit()}
            loading={isSubmitting}
          >
            Add
          </Button>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24}>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Event ID"
                    name="eventId"
                    rules={[
                      {
                        required: true,
                        message: "Please input the unique id!",
                      },
                    ]}
                  >
                    <Input className="font-normal" placeholder="E001" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Location"
                    name="location"
                    rules={[
                      { required: true, message: "Please input the location!" },
                    ]}
                  >
                    <Input
                      className="font-normal"
                      placeholder="Enter Event Location"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Event Date"
                    name="date"
                    rules={[
                      {
                        required: true,
                        message: "Please select the event date!",
                      },
                    ]}
                  >
                    <DatePicker className="font-normal" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Event Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please input the event name!",
                      },
                    ]}
                  >
                    <Input className="font-normal" placeholder="Event Name" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the description!",
                      },
                    ]}
                  >
                    <TextArea
                      className="font-normal"
                      placeholder="Description of the Event"
                      rows={8}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddEvent;
