import React from "react";
import { connect } from 'react-redux';
import { Table, Divider, Spin } from "antd";
import { LoanService } from '../services';

const loanService = new LoanService();

class IssuedLoans extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            spinning: true,
            issuedLoans: []
        };
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async componentDidMount() {
        console.log("braidConnectStatus:", this.props.braidStatus, this.props.braidConnect)
        await this.sleep(1000);
        this.fetchIssuedLoans();
    }

    fetchIssuedLoans() {
        loanService.fetchIssuedLoans(this.props.braidConnect)
            .then(
                issuedLoans => {
                    this.setState({ issuedLoans: issuedLoans, spinning: false });
                },
                error => {
                    console.log("Error while fetching loans:", error);
                }
            );
    }

    render() {
        const statusList = ['open', 'verified', 'issued', 'proposed', 'locked', 'complete'];
        const actionList = ['verify', 'issue', 'propose', 'lock', 'complete'];
        const issuedLoanColumns = [
            {
                title: "REQ ID",
                dataIndex: "loanReqID",
                key: "loanReqID "
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
                title: "LOAN ID",
                dataIndex: "loanId",
                key: "loanId",
                // render: (status, record) => (
                //     <span style={{ color: '#008b7d', fontWeight: '500', cursor: 'pointer' }} onClick={() => { this.showStatusFlow(record.loanReqID) }}>{status.toUpperCase()}</span>
                // )
            },
            {
                title: "Action",
                dataIndex: "action",
                key: "action",
                // render: (text, record) => (
                //     <span>
                //         <span style={{ color: 'green', cursor: 'pointer', textTransform: 'capitalize' }}> {actionList[statusList.indexOf(record.status.toLowerCase())]}</span>
                //         <Divider type="vertical" />
                //         <span style={{ color: 'brown', cursor: 'pointer', textTransform: 'capitalize' }}> Reject </span>
                //     </span>
                // )
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
                </div>
                <Spin size="large" spinning={this.state.spinning}>
                    <Table
                        dataSource={this.state.issuedLoans}
                        columns={issuedLoanColumns}
                        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20', '30'] }} />
                </Spin>
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
