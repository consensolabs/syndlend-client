import React from 'react';
import { Row, Col, Button, Table, Divider } from 'antd';

const collateralData = [
  {
    key: '1',
    asset: 'REC 001',
    description: 'Description REC 001',
    documents: ['DOC 001.pdf', 'DOC 002.pdf', 'DOC 003.pdf'],
  },
  {
    key: '2',
    asset: 'REC 002',
    description: 'Description REC 002',
    documents: ['DOC 004.pdf', 'DOC 005.pdf'],
  },
];

const collateralCols = [
  {
    title: 'Asset',
    dataIndex: 'asset',
    key: 'asset',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Documents',
    dataIndex: 'documents',
    key: 'documents',
    render: documents => (
      <span>
        {documents.map(document => {
          return (
            <span><a href=''>{document}</a><Divider type="vertical" /></span>
          );
        })}
      </span>
    ),
  },
];

const projectsData = [
  {
    key: '1',
    id: 'REF0023',
    lender: 'Agent 001',
    description: 'Pro Description',
    status: 'Issued'
  },
  {
    key: '2',
    id: 'REF0024',
    lender: 'Agent 002',
    description: 'Pro Description',
    status: 'Proposed'
  },
];

const projectCols = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Lender',
    dataIndex: 'lender',
    key: 'lender',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: status => (
      <span>
        <a href="">{status}</a>
      </span>
    )
  },
];

const Profile = () => {
  return (
    <div>
      <h2>Profile</h2>
      <Row>
        <Col span={8}>
          <div style={{ margin: "1.25em 0em" }}>
            <span style={{
              fontSize: "1.25em",
              fontWeight: 500
            }}>Basic Details
            <Button
                type="link"
                icon="edit"
              >
              </Button>
            </span>
          </div>
        </Col>
      </Row>
      <Row style={{ margin: '20px 0px' }}>
        <Col span={4}>
          <div>
            <span style={{
              margin: "1em 0em",
              fontSize: "1.0em",
              fontWeight: 500
            }}>Company Name </span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span style={{
              margin: "1em 0em",
              fontSize: "1.0em",
              fontWeight: 400
            }}>Consenso Labs Pvt. Ltd. </span>
          </div>
        </Col>
      </Row>
      <Row style={{ margin: '20px 0px' }}>
        <Col span={4}>
          <div>
            <span style={{
              margin: "1em 0em",
              fontSize: "1.0em",
              fontWeight: 500
            }}>Contact </span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span style={{
              margin: "1em 0em",
              fontSize: "1.0em",
              fontWeight: 400
            }}>044-22364778 </span>
          </div>
        </Col>
      </Row>
      <Row style={{ margin: '20px 0px' }}>
        <Col span={4}>
          <div>
            <span style={{
              margin: "1em 0em",
              fontSize: "1.0em",
              fontWeight: 500
            }}>Address </span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span style={{
              margin: "1em 0em",
              fontSize: "1.0em",
              fontWeight: 400
            }}> {'Flat No: 234/1, 4th Floor, Go Spaze'} <br />  {'Siddhapura, Bangalore - 560038'} <br /> {'Karnataka, India'}</span>
          </div>
        </Col>
      </Row>
      <Row style={{ margin: '20px 0px' }}>
        <Col span={10}>
            <h2>Collaterals</h2>
        </Col>
        <Col style={{float:'right'}}>
            <Button type="link" style={{float:'right',fontWeight:'500'}}>+ ADD A COLLATERAL</Button>
        </Col>
      </Row>
      <Row style={{ margin: '20px 0px' }}>
        <Col span={20}>
          <Table dataSource={collateralData} columns={collateralCols} />
        </Col>
      </Row>
      <Row style={{ margin: '20px 0px' }}>
        <Col span={10}>
            <h2>Projects</h2>
        </Col>
        <Col style={{float:'right'}}>
            <Button type="link" style={{float:'right',fontWeight:'500'}}>+ ADD A PROJECT</Button>
        </Col>
      </Row>
      <Row style={{ margin: '20px 0px' }}>
        <Col span={20}>
          <Table dataSource={projectsData} columns={projectCols} />
        </Col>
      </Row>
    </div>
  );
};

export default Profile;