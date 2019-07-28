import React from "react";
import { connect } from 'react-redux';
import { Modal, Button, Table, Divider, Spin } from "antd";
import LoanReqFormWrapper from "./loan-request-wrapper.js";
import StatusFlowDisplayWrapper from "./status-display-wrapper.js";
import { fetchAllLoanRequests } from '../actions';
import {LoanService} from '../services';

class BorrowerDashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      showSlider: false,
      spinning: true,
      requestedLoans: [],
    };
    this.showLoanReqModal = this.showLoanReqModal.bind(this);
    this.showStatusSliderModal = this.showStatusSliderModal.bind(this);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async componentDidMount() {
    console.log("braidConnectStatus:", this.props.braidStatus, this.props.braidConnect)
    await this.sleep(1000);
    // this.props.fetchAllLoanRequests(this.props.braidConnect);
    let loanService = new LoanService();
    loanService.fetchRequestedLoans(this.props.braidConnect)
      .then(
        requestedLoans => {
          this.setState({requestedLoans:requestedLoans, spinning:false});
        },
        error => {
          console.log("Error while fetching loans:", error);
        }
      );
  }

  showLoanReqModal = () => {
    this.setState({
      showForm: true
    });
  };

  showStatusSliderModal = () => {
    this.setState({
      showSlider: true
    });
  };

  handleOk = e => {
    this.setState({
      showForm: false,
      showSlider: false
    });
  };

  handleCancel = e => {
    this.setState({
      showForm: false,
      showSlider: false
    });
  };

  showStatusFlow = (id) => {
    this.braid.syndService.listLoanRequestDetails(id)
      .then(responseJson => {
        console.log("Status Flow:", responseJson)
        this.showStatusSliderModal();
      })
  }

  render() {
    const statusList = ['open', 'verified', 'issued', 'proposed', 'locked', 'complete'];
    const actionList = ['verify', 'issue', 'propose', 'lock', 'complete'];
    const columns = [
      {
        title: "REQ ID",
        dataIndex: "loanReqID",
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
        render: (status, record) => (
          <span style={{ color: '#008b7d', fontWeight: '500', cursor: 'pointer' }} onClick={() => { this.showStatusFlow(record.loanReqID) }}>{status.toUpperCase()}</span>
        )
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (text, record) => (
          <span>
            <span style={{ color: 'green', cursor: 'pointer', textTransform: 'capitalize' }}> {actionList[statusList.indexOf(record.status.toLowerCase())]}</span>
            <Divider type="vertical" />
            <span style={{ color: 'brown', cursor: 'pointer', textTransform: 'capitalize' }}> Reject </span>
          </span>
        )
      }
    ];
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
              onClick={this.showLoanReqModal}
            >
              ADD REQUEST
            </Button>

            <Modal
              title="Create a Loan Request"
              visible={this.state.showForm}
              onOk={this.handleOk}
              footer={null}
              onCancel={this.handleCancel}
            >
              <LoanReqFormWrapper />

            </Modal>
          </div>

          <Spin size="large" spinning={this.state.spinning}>
            <Table dataSource={this.state.requestedLoans} columns={columns} />
          </Spin>

          <Modal
            title="Status Timeline"
            visible={this.state.showSlider}
            onOk={this.handleOk}
            footer={null}
            onCancel={this.handleCancel}
          >
            <StatusFlowDisplayWrapper />

          </Modal>
        </div>

        <div>
          <div className="requests-bar">
            <span
              style={{
                margin: "1em 0em",
                fontSize: "1.17em",
                fontWeight: 500
              }}
            >
              Live Deals
          </span>
          </div>
          <Table dataSource={[]} columns={columns} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    braidConnect: state.braidConnect,
    braidStatus: state.braidStatus,
    loanRequests: state.loanRequests
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllLoanRequests: (braidConnect) => {
      dispatch(fetchAllLoanRequests(braidConnect));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BorrowerDashboard);