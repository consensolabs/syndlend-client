import React from "react";
import { connect } from 'react-redux';
import { Modal, Button, Table, Divider, Spin, Tag, Popover } from "antd";
import { LoanService } from '../services';
import LoanReqFormWrapper from "./loan-request-wrapper.js";
import LoanRequestDetails from "./loan-request-details-modal";
import StatusFlowDisplayWrapper from "./status-display-wrapper.js";
import {UserContext} from "../Context";
import Transactions from "./transactions";

const loanService = new LoanService();

const confirm = Modal.confirm;

class RequestedLoans extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showForm: false,
            showSlider: false,
            spinning: true,
            requestedLoans: [],
            peers: [],
            loanRequestStatus: null,
            showLoanRequestDetailsModal: false
        };
        this.showLoanReqModal = this.showLoanReqModal.bind(this);
        this.showStatusSliderModal = this.showStatusSliderModal.bind(this);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async componentDidMount() {

        this.fetchRequestedLoans();
        this.fetchPeerInfo();
    }

    fetchPeerInfo() {
        loanService.fetchPeers(this.context.connection)
            .then(
                peers => {
                    this.setState({ peers: peers });
                },
                error => {
                    console.log("Error while peers info:", error);
                }
            );
    }

    fetchRequestedLoans() {
        loanService.fetchRequestedLoans(this.context.connection)
            .then(
                requestedLoans => {
                    this.setState({ requestedLoans: requestedLoans, spinning: false });
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

    showStatusSliderModal = (status) => {
        this.setState({
            showSlider: true,
            loanRequestStatus: status
        });
    };

    showLoanRequestDetailsModal = (record) => {
        this.setState({
            showLoanRequestDetailsModal: true,
            loanRequestDetails: record
        });
    };

    handleOk = e => {
        this.setState({
            showForm: false,
            showSlider: false,
            showLoanRequestDetailsModal: false
        });
        this.fetchRequestedLoans();
    };

    handleCancel = e => {
        this.setState({
            showForm: false,
            showSlider: false,
            showLoanRequestDetailsModal: false
        });
    };

    showStatusFlow = (status) => {
        // this.props.braidConnect.syndService.listLoanRequestDetails(id)
        //     .then(responseJson => {
        //         console.log("Status Flow:", responseJson)
        //         this.showStatusSliderModal();
        //     });

        this.showStatusSliderModal(status);
    };

    updateLoanStatus = (id, status) => {

        const rpc = this.context.connection;
        confirm({
            title: `Do you want to ${status} against Request ID: ${id}?`,
            okText: 'Confirm',
            onOk() {
                loanService.updateLoanStatus(rpc, id, status)
                .then(
                    response => {
                        this.fetchRequestedLoans();
                    },
                    error => {
                        console.log("Error while fetching loans:", error);
                    }
                );
            },
            onCancel() { },
        });
    };

    render() {
        const statusList = ['open', 'verified', 'issued', 'proposed', 'locked', 'complete'];
        const actionList = ['verify', 'issue', 'finalize'];
        const requestedLoanColumns = [
            {
                title: "REQ ID",
                dataIndex: "loanReqID",
                key: "loanReqID ",
                render: (id, record) => (
                    <Button type="link"  onClick={() => {this.showLoanRequestDetailsModal(record);}}>{id}</Button>
                )
            },
            {
                title: "Borrower Node",
                dataIndex: "borrowerName",
                key: "borrowerName"
            },
            {
                title: "Timestamp",
                dataIndex: "timestamp",
                key: "timestamp"
            },

            {
                title: "Amount (USD)",
                dataIndex: "amount",
                key: "amount"
            },

            {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (status, record) => (
                    <span  onClick={() => { this.showStatusFlow(status) }}>
                        <Popover content={<StatusFlowDisplayWrapper status={status}/>} title="Loan request status">
                        <Tag style={{fontWeight: '500', cursor: 'pointer' }} color={"blue"}>
                  {status.toUpperCase()}
                    </Tag>
                        </Popover>


                    </span>
                )
            },
            {
                title: "Action",
                dataIndex: "action",
                key: "action",
                render: (text, record) => (
                    statusList.indexOf(record.status.toLowerCase()) < 2 ?
                    <span>
                        <Button icon={"check-circle"} onClick={() => { this.updateLoanStatus(record.loanReqID, actionList[statusList.indexOf(record.status.toLowerCase())]) }}>
                        <span style={{ color: 'green', cursor: 'pointer', textTransform: 'capitalize' }} >
                            {actionList[statusList.indexOf(record.status.toLowerCase())]}
                        </span>
                        </Button>
                        <Divider type="vertical" />
                        <Button icon={"close-circle"} onClick={() => { this.updateLoanStatus(record.loanReqID, actionList[statusList.indexOf(record.status.toLowerCase())]) }}>
                        <span style={{ color: 'brown', cursor: 'pointer', textTransform: 'capitalize' }}> Reject </span>
                        </Button>
                    </span> :
                        <Button icon={"check-circle"}>
                            <span style={{ cursor: 'pointer', textTransform: 'capitalize' }} >
                            {actionList[statusList.indexOf(record.status.toLowerCase())]}
                            </span>
                        </Button>
                )
            }
        ];

        return (
            <React.Fragment>
                <div className="requests-bar">
                    <span
                        style={{
                            margin: "1em 0em",
                            fontSize: "1.17em",
                            fontWeight: 500
                        }}
                    >
                        Requested Loans
                    </span>

                    <Button type="primary" onClick={e => { this.setState({ spinning: true }); this.fetchRequestedLoans() }} shape="circle" icon="reload" size={'medium'} style={{ float: "right", marginLeft: '15px' }} />

                    <Button
                        type="primary"
                        icon="plus"
                        style={{ float: "right" }}
                        onClick={this.showLoanReqModal} >
                        ADD REQUEST
                    </Button>

                    <Modal
                        title="Create a Loan Request"
                        visible={this.state.showForm}
                        onOk={this.handleOk}
                        footer={null}
                        onCancel={this.handleCancel} >

                        <LoanReqFormWrapper handleOk={this.handleOk} peers={this.state.peers} connection={this.context.connection}/>

                    </Modal>
                </div>

                <Spin size="large" spinning={this.state.spinning}>
                    <Table
                        dataSource={this.state.requestedLoans}
                        columns={parseInt(this.props.roleId)===0 ? requestedLoanColumns.slice(0,-1):requestedLoanColumns}
                        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20', '30'] }} />
                </Spin>

                <Modal
                    title="Status Timeline"
                    visible={this.state.showSlider}
                    onOk={this.handleOk}
                    footer={null}
                    onCancel={this.handleCancel} >

                    <StatusFlowDisplayWrapper status={this.state.loanRequestStatus}/>

                </Modal>

                <Modal
                    title="Loan Request Details"
                    visible={this.state.showLoanRequestDetailsModal}
                    onOk={this.handleOk}
                    footer={null}
                    onCancel={this.handleCancel}
                >

                    <LoanRequestDetails loanRequestDetails={this.state.loanRequestDetails} handleOk={this.handleOk} me={this.context.me}/>

                </Modal>
            </React.Fragment>
        )
    }
}


export default RequestedLoans;

RequestedLoans.contextType=UserContext;
