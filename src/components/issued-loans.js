import React from "react";
import { connect } from 'react-redux';
import { Modal, Table, Divider, Spin, Button, Badge } from "antd";
import { LoanService } from '../services';
import LoanProposalForm from "./loan-proposal-modal";
import ProposalDetails from './proposal-details';

const loanService = new LoanService();

const statusList = ['issued', 'proposed', 'locked', 'complete'];
const actionList = ['propose', 'lock', 'complete'];

class IssuedLoans extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            spinning: true,
            issuedLoans: [],
            lendProposals: [],
            loanInfo: {},
            showProposalForm: false,
            showProposalDetails: false,
        };
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async componentDidMount() {
        console.log("braidConnectStatus:", this.props.braidStatus, this.props.braidConnect)
        await this.sleep(1000);
        this.fetchIssuedLoans();
        this.fetchLendProposals();
    }

    handleOk = e => {
        this.setState({
            showProposalForm: false,
            showProposalDetails: false,
            showSlider: false
        });
        this.fetchRequestedLoans();
    };

    handleCancel = e => {
        this.setState({
            showProposalForm: false,
            showProposalDetails: false,
            showSlider: false
        });
    };

    showProposalModal = (loanInfo) => {
        this.setState({
            showProposalForm: true,
            loanInfo: loanInfo,
        });
    };

    showProposalDetailsModal = (loanInfo) => {
        this.setState({
            showProposalDetails: true,
            loanInfo: loanInfo,
        });
    };

    fetchIssuedLoans() {
        loanService.fetchIssuedLoans(this.props.braidConnect)
            .then(
                issuedLoans => {
                    this.setState({ issuedLoans: issuedLoans, spinning: false });
                    console.log('non dub loans', this.state.issuedLoans.filter((loan) => {return loan.status === "ISSUED"}));

                },
                error => {
                    console.log("Error while fetching loans:", error);
                }
            );
    }

    fetchLendProposals() {
        loanService.fetchLendProposals(this.props.braidConnect)
            .then(
                lendProposals => {
                    this.setState({ lendProposals: lendProposals, spinning: false });
                },
                error => {
                    console.log("Error while fetching loans:", error);
                }
            );
    }

    formatLendProposals(lendProposals) {
        let lendPoposalsDict = {};
        console.log("format lend proposals");
        lendProposals.forEach((item) => {

            if (!lendPoposalsDict[item.loanId]){
            lendPoposalsDict[item.loanId] = [item];
            }
            else {
                lendPoposalsDict[item.loanId].push(item);
            }
        }
            );

        return lendPoposalsDict;

    }

    getActionButton(record) {

        let formattedProposals = this.formatLendProposals(this.state.lendProposals)[record.loanId];
        let pendingProposals = formattedProposals ? formattedProposals.filter((prop) => {return !prop.accepted}) : [];

        return(
            <span>
                {parseInt(this.props.roleId) === 1 ?
                    <Badge count={pendingProposals.length} overflowCount={5}>

                    <Button icon={"folder-open"} onClick={() => {
                        this.showProposalDetailsModal(record)
                    }}>
                        <span style={{color: '#1890ff', cursor: 'pointer', textTransform: 'capitalize'}}>
                            Proposals
                        </span>
                    </Button>
                    </Badge>
                    :
                    <Button icon={"check-circle"} onClick={() => {
                        this.showProposalModal(record)
                    }}>
                        <span style={{color: 'green', cursor: 'pointer', textTransform: 'capitalize'}}>
                            Propose
                        </span>
                    </Button>
                }
                    </span>


        );
    }

    render() {

        const issuedLoanColumns = [
            {
                title: "LOAN ID",
                dataIndex: "loanId",
                key: "loanId",
            },
            {
                title: "Borrower Node",
                dataIndex: "borrowerNode",
                key: "borrowerNode"
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
            },


            {
                title: "Action",
                dataIndex: "action",
                key: "action",
                render: (text, record) => (
                    statusList.indexOf(record.status.toLowerCase()) < 2 ?
                        this.getActionButton(record) :
                        <Button disabled>
                            none
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
                        }} >
                        Issued Loans
                    </span>

                <Button type="primary" onClick={e => { this.setState({ spinning: true }); this.fetchIssuedLoans() ; this.fetchLendProposals() }} shape="circle" icon="reload" size={'medium'} style={{ float: "right", marginLeft: '15px' }} />
                </div>
                    <Spin size="large" spinning={this.state.spinning}>
                    <Table
                        dataSource={this.state.issuedLoans}
                        columns={issuedLoanColumns}
                        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20', '30'] }} />
                </Spin>
                <Modal
                    title="Create a proposal for lending"
                    visible={this.state.showProposalForm}
                    onOk={this.handleOk}
                    footer={null}
                    onCancel={this.handleCancel} >

                    <LoanProposalForm handleOk={this.handleOk} loanInfo={this.state.loanInfo}/>

                </Modal>

                <Modal
                    title="Lending proposal details"
                    visible={this.state.showProposalDetails}
                    onOk={this.handleOk}
                    footer={null}
                    onCancel={this.handleCancel} >

                    <ProposalDetails handleOk={this.handleOk} loanInfo={this.state.loanInfo} lendProposals={this.formatLendProposals(this.state.lendProposals)[this.state.loanInfo.loanId]}/>

                </Modal>
            </React.Fragment>
        );
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
)(IssuedLoans);
