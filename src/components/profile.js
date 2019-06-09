import React from 'react';
import { Row, Col, Button } from 'antd';

const Profile = () => {
  return (
    <div>
      <h2>Profile</h2>
      <Row>
        <Col span={8}>
          <div style={{ margin: "1.5em 0em" }}>
            <span style={{
              fontSize: "1.17em",
              fontWeight: 500
            }}>Basic Details
            <Button
                type="link"
                icon="edit"
              >
              </Button>
            </span>
          </div>
          
          <div>
            <span style={{
              margin: "1em 0em",
              fontSize: "1.0em",
              fontWeight: 500
            }}>Company Name </span>

          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;