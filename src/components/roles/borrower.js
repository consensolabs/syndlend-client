import React from "react";

import { Modal, Button, Table, Divider } from "antd";

import LoanReqFormWrapper from "../loanreqform.js";

const dataSource = [
  {
    key: "1",
    id: "REF573535",
    agent: 'Mike',
    amount: "10,00,000",
    description: "Test Description",
    status: 'open'
  },
  {
    key: "2",
    id: "REF573536",
    agent: 'John',
    amount: "10,50,000",
    description: "Test Description",
    status: 'verified'
  },
  {
    key: "3",
    id: "REF573537",
    agent: 'Sham',
    amount: "12,00,000",
    description: "Test Description",
    status: 'locked'
  },
  {
    key: "4",
    id: "REF573538",
    agent: 'Ram',
    amount: "10,40,000",
    description: "Test Description",
    status: 'issued'
  },
];


const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "Agent",
    dataIndex: "agent",
    key: "agent"
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount"
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description"
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: status => (
      <span style={{color:'#008b7d',fontWeight:'500',cursor:'pointer'}}>{status.toUpperCase()}</span>
    )
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (text, record) => (
      <span>
        <span style={{color:'green',cursor:'pointer',textTransform:'capitalize'}}> {actionList[statusList.indexOf(record.status)]}</span>
        <Divider type="vertical" />
        <span style={{color:'brown',cursor:'pointer',textTransform:'capitalize'}}> Reject </span>
      </span>
    )
  }
];

const statusList = [ 'open', 'verified', 'issued', 'proposed', 'locked', 'complete']
const actionList = [ 'verify', 'issue', 'propose', 'lock', 'complete']

class BorrowerDashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.showModal = this.showModal.bind(this);
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  render() {
    return (
      <div>
        <h2> Dashboard </h2>

        <div>
          <div className="requests-bar">
            <span
              style={{
                margin: "1em 0em",
                fontSize: "1.17em",
                fontWeight: 500
              }}
            >
              Loan Requests
            </span>

            <Button
              type="primary"
              icon="plus"
              style={{ float: "right" }}
              onClick={this.showModal}
            >
              ADD REQUEST
            </Button>

            <Modal
              title="Create a Loan Request"
              visible={this.state.visible}
              onOk={this.handleOk}
              footer={null}
              onCancel={this.handleCancel}
            >
              <LoanReqFormWrapper />

            </Modal>
          </div>
          <Table dataSource={dataSource} columns={columns} />
        </div>

        <div>
          <span
            style={{
              margin: "1em 0em",
              fontSize: "1.17em",
              fontWeight: 500
            }}
          >
            Live Deals
          </span>

          <Table dataSource={dataSource} columns={columns} />
        </div>
      </div>
    );
  }
}

export default BorrowerDashboard;