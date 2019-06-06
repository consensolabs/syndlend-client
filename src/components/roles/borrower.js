import React from "react";
import { Modal, Button, Table, Divider } from "antd";
import LoanReqFormWrapper from "../loanreqform.js";
import {Proxy} from 'braid-client';




const columns = [
    {
        title: "REQ ID",
        dataIndex: "loanReqID.id",
        key: "loanReqID "
    },
    {
        title: "Borrower Name",
        dataIndex: "companyName",
        key: "companyName"
    },
    {
        title: "Timestamp",
        dataIndex: "timestamp",
        key: "timestamp"
    },

    {
        title: "Amount",
        dataIndex: "amount",
        key: "amount"
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
      visible: false,
      loanRequests: [],
    };
    this.showModal = this.showModal.bind(this);


  }

    componentWillMount() {

        this.onRPCOpen = this.onRPCOpen.bind(this);
        this.braid = new Proxy({
            url: "http://projects.koshikraj.com:8888/api/"
        }, this.onRPCOpen, this.onRPCClose, this.onRPCError, { strictSSL: false });


    }


    onRPCOpen() { console.log('Connected to node.');
        this.braid.syndService.listLoanRequests(
            result => {console.log("State details: " + JSON.stringify(result) + "!");

            let dataSource = [];
            result.map(item => dataSource.push(item.state.data))
            this.setState({loanRequests:dataSource});
            });
    }

    onRPCClose() { console.log('Disconnected from node.'); }

    onRPCError(err) { console.error(err); }


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
          <Table dataSource={this.state.loanRequests} columns={columns} />
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

          <Table dataSource={[]} columns={columns} />
        </div>
      </div>
    );
  }
}

export default BorrowerDashboard;
