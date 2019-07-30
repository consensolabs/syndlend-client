import React from "react";
import { connect } from 'react-redux';
import { Modal, Button, Table, Divider, Spin } from "antd";
import { LoanService } from '../services';
import LoanReqFormWrapper from "./loan-request-wrapper.js";
import StatusFlowDisplayWrapper from "./status-display-wrapper.js";

const loanService = new LoanService();

const confirm = Modal.confirm;

class RequestedLoans extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showForm: false,
            showSlider: false,
            spinning: true,
            requestedLoans: []
        }
        this.showLoanReqModal = this.showLoanReqModal.bind(this);
        this.showStatusSliderModal = this.showStatusSliderModal.bind(this);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async componentDidMount() {
        console.log("braidConnectStatus:", this.props.braidStatus, this.props.braidConnect.syndService)
        console.log("braidConnectStatus:", this.props.braidStatus, this.props.braidConnect.syndService)
        while (!this.props.braidConnect.syndService) {
            console.log("waiting for connection: sleeping for 500 ms")
            await this.sleep(1200);
        }

        console.log("braidConnectStatus:", this.props.braidStatus, this.props.braidConnect.syndService)
        this.fetchRequestedLoans();
    }

    fetchRequestedLoans() {
        loanService.fetchRequestedLoans(this.props.braidConnect)
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
        this.fetchRequestedLoans();
    };

    handleCancel = e => {
        this.setState({
            showForm: false,
            showSlider: false
        });
    };

    showStatusFlow = (id) => {
        this.props.braidConnect.syndService.listLoanRequestDetails(id)
            .then(responseJson => {
                console.log("Status Flow:", responseJson)
                this.showStatusSliderModal();
            })
    }

    updateLoanStatus = (id, status) => {
        console.log("ID, Status:", id, status, this.props.braidConnect)
        const rpc = this.props.braidConnect;
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
    }

    render() {
        const statusList = ['open', 'verified', 'issued', 'proposed', 'locked', 'complete'];
        const actionList = ['verify', 'issue', 'propose', 'lock', 'complete'];
        const requestedLoanColumns = [
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
                        <span style={{ color: 'green', cursor: 'pointer', textTransform: 'capitalize' }} onClick={() => { this.updateLoanStatus(record.loanReqID, actionList[statusList.indexOf(record.status.toLowerCase())]) }}>
                            {actionList[statusList.indexOf(record.status.toLowerCase())]}
                        </span>
                        <Divider type="vertical" />
                        <span style={{ color: 'brown', cursor: 'pointer', textTransform: 'capitalize' }}> Reject </span>
                    </span>
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

                    <Button type="primary" onClick={e => { this.setState({ spinning: true }); this.fetchRequestedLoans() }} shape="circle" icon="reload" size={'large'} style={{ float: "right", marginLeft: '15px' }} />

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

                        <LoanReqFormWrapper handleOk={this.handleOk} />

                    </Modal>
                </div>

                <Spin size="large" spinning={this.state.spinning}>
                    <Table
                        dataSource={this.state.requestedLoans}
                        columns={requestedLoanColumns}
                        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20', '30'] }} />
                </Spin>

                <Modal
                    title="Status Timeline"
                    visible={this.state.showSlider}
                    onOk={this.handleOk}
                    footer={null}
                    onCancel={this.handleCancel} >

                    <StatusFlowDisplayWrapper />

                </Modal>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        braidConnect: state.braidConnect,
        braidStatus: state.braidStatus
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RequestedLoans);
