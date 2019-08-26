import React from "react";
import { Modal, Button, Table, Divider, Spin, Tag, Popover } from "antd";
import { LoanService } from '../services';
import DisbursalSettingsForm from "./disbursal-settings-modal";
import StatusFlowDisplayWrapper from "./status-display-wrapper.js";
import {UserContext} from "../Context";

const loanService = new LoanService();

const confirm = Modal.confirm;

class DisbursalDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showForm: false,
            showSlider: false,
            spinning: true,
            obligationList: [],
            loanRequestStatus: null,
            obligationInfo: null,
            peers: [],
        };
        this.showPaymentInfoModal = this.showPaymentInfoModal.bind(this);
        this.showStatusSliderModal = this.showStatusSliderModal.bind(this);
    }


    async componentDidMount() {

        this.fetchObligations();
        this.fetchPeerInfo();
    }


    fetchObligations() {
        loanService.fetchObligations(this.context.connection)
            .then(
                obligationList => {
                    this.setState({ obligationList: obligationList, spinning: false });
                    console.log(obligationList);
                },
                error => {
                    console.log("Error while fetching loans:", error);
                }
            );
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

    showPaymentInfoModal = (obligation) => {
        this.setState({
            showForm: true,
            obligationInfo: obligation
        });
    };

    showStatusSliderModal = (status) => {
        this.setState({
            showSlider: true,
            loanRequestStatus: status
        });
    };

    handleOk = e => {
        this.setState({
            showForm: false,
            showSlider: false
        });
        this.fetchObligations();
    };

    handleCancel = e => {
        this.setState({
            showForm: false,
            showSlider: false
        });
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
                        this.fetchObligations();
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

        const requestedLoanColumns = [
            {
                title: "PAYMENT ID",
                dataIndex: "obligationId",
                key: "obligationId "
            },
            {
                title: "Lender Node",
                dataIndex: "lenderNode",
                key: "lenderNode"
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
                    <span  onClick={() => { this.showStatusFlow(status) }}>
                        {/*<Popover content={<StatusFlowDisplayWrapper status={status}/>} title="Loan request status">*/}
                        <Tag style={{fontWeight: '500', cursor: 'pointer' }} color={"blue"}>
                  {status.toUpperCase()}
                    </Tag>
                        {/*</Popover>*/}


                    </span>
                )
            },
            {
                title: "Action",
                dataIndex: "action",
                key: "action",
                render: (text, record) => (

                        <Button icon={"setting"} onClick={() => {this.showPaymentInfoModal(record)}}>
                            <span style={{ cursor: 'pointer', textTransform: 'capitalize' }} >
                            Settings
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
                        Received Payments
                    </span>

                    <Button type="primary" onClick={e => { this.setState({ spinning: true }); this.fetchObligations() }} shape="circle" icon="reload" size={'medium'} style={{ float: "right", marginLeft: '15px' }} />


                    <Modal
                        title="Payment details"
                        visible={this.state.showForm}
                        onOk={this.handleOk}
                        footer={null}
                        onCancel={this.handleCancel} >

                        <DisbursalSettingsForm handleOk={this.handleOk} connection={this.context.connection} peers={this.state.peers} obligationInfo={this.state.obligationInfo}/>

                    </Modal>
                </div>

                <Spin size="large" spinning={this.state.spinning}>
                    <Table
                        dataSource={this.state.obligationList}
                        columns={requestedLoanColumns}
                        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20', '30'] }} />
                </Spin>

            </React.Fragment>
        )
    }
}


export default DisbursalDetails;

DisbursalDetails.contextType=UserContext;
