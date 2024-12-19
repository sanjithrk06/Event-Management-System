import React, { useState, useEffect } from "react";
import { Card, Col, Row, Statistic, message } from "antd";
import axios from "axios";

const Dashboard = () => {
  const [eventsCount, setEventsCount] = useState(0);
  const [registrationsCount, setRegistrationsCount] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const eventsResponse = await axios.get(
        "http://localhost:5001/api/event/count"
      );
      const registrationsResponse = await axios.get(
        "http://localhost:5001/api/registration/count"
      );

      setEventsCount(eventsResponse.data.count || 0);
      setRegistrationsCount(registrationsResponse.data.count || 0);
    } catch (error) {
      console.error("Error fetching counts:", error);
      // message.error("Failed to fetch dashboard data");
    }
  };

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title="Events"
            value={eventsCount || 2}
            precision={0}
            valueStyle={{
              color: "#f67009",
            }}
            suffix=" Events"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title="Registrations"
            value={registrationsCount || 1}
            precision={0}
            valueStyle={{
              color: "#f67009",
            }}
            suffix=" Registrations"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;
