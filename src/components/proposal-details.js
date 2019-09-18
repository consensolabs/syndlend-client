import React from 'react';
import 'antd/dist/antd.css';
import {
  Select,
  Icon,
    Empty,
    Popconfirm,
    message,
    Collapse,
    Divider,
    Button,
    Tag,
    Row,
    Col,
} from 'antd';
import { LoanService } from '../services';
import {connect} from "react-redux";
import {UserContext} from "../Context";
import Transactions from "./transactions";

const loanService = new LoanService();

const { Option } = Select;

const { Panel } = Collapse;


const customPanelStyle = {
    background: '#f7fff6',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden',
};

const DescriptionItem = ({ title, content }) => (
    <div
        style={{
            fontSize: 14,
            lineHeight: '22px',
            marginBottom: 7,
            color: 'rgba(0,0,0,0.65)',
        }}
    >
        <p
            style={{
                marginRight: 8,
                display: 'inline-block',
                color: 'rgba(0,0,0,0.85)',
            }}
        >
            {title}:
        </p>
        {content}
    </div>
);





class ProposalDetails extends React.Component {

  constructor(props) {
    super(props);
  }



    verificationStatus() {
      return (


              <Tag style={{cursor: 'pointer'}} color='green'>
                  {this.props.loanInfo.status}
              </Tag>

      )
    }


    getAcceptButton(accepted, proposalId) {
    return (
        <Popconfirm
            title="Are you sure you want to accept the proposal?"
            disabled={accepted}
            onConfirm={() => {

                loanService.createLendResponse(this.props.connection, proposalId)
                    .then(
                        response => {
                            message.loading('Accepting the proposal:' + proposalId, 2)
                                .then(() => message.success('Proposal has been accepted', 1));
                            console.log("Successfully accepted the proposal:", response);
                        },
                        error => {
                            console.log("Error while accepting proposal:", error);
                        }
                    );
            }}
            // onCancel={}
            okText="Yes"
            cancelText="No"
        >
        <Button type="primary" icon="check-circle" disabled={accepted}

    > { accepted ? 'Accepted' : ''}
    </Button>
        </Popconfirm>)
    }

    getSyndicateButton(accepted, proposalId) {
        return (
            <Popconfirm
                title="Are you sure you want to process this loan?"
                disabled={!accepted}
                onConfirm={() => {

                    let proposalIds = [];

                    this.props.lendProposals.map((proposal) => {proposalIds.push(proposal.proposalId)})

                    loanService.syndicateLoan(this.props.connection, proposalIds)
                        .then(
                            response => {
                                message.loading('Syndicating the loan:' + this.props.loanInfo.loanId, 2)
                                    .then(() => message.success('Loan has been syndicated', 1));
                                console.log("Successfully syndicated the loan:", response);
                            },
                            error => {
                                console.log("Error while syndicating the loan:", error);
                            }
                        );
                }}
                okText="Yes"
                cancelText="No"
            >
                <Button type="primary" icon="pie-chart" disabled={!accepted}

                > Syndicate Loan
                </Button>
            </Popconfirm>)
    }



  render() {

      const pStyle = {
          fontWeight: 'bold',
          fontSize: 16,
          color: 'rgba(0,0,0,0.85)',
          lineHeight: '24px',
          display: 'block',
          marginBottom: 16,
      };


      return (
        <div>
            <p style={pStyle}>
                <Icon type="info-circle" theme="filled" />{" "}
                Basic Info
            </p>

            <Row>

                    <DescriptionItem title="Loan ID" content={this.props.loanInfo.loanId}/>

            </Row>
            <Row>
                    <DescriptionItem title="Borrower" content={this.props.loanInfo.borrowerNode}/>

            </Row>
            <Row>

                    <DescriptionItem title="Amount" content={this.props.loanInfo.amount} />

            </Row>
            <Divider/>


            <p style={pStyle}>
                <Icon type="bank" theme="filled" /> {" "}
                Proposals
            </p>
            {this.props.lendProposals ?
                <Collapse
                    bordered={false}
                    defaultActiveKey={['1']}
                    expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0}/>}
                >

                    {this.props.lendProposals.map( (item) => {
                    return(

                    <Panel header={item.proposalId} key={item.proposalId} style={customPanelStyle}  extra={this.getAcceptButton(item.accepted, item.proposalId)}>

                    <Row key={item.proposalId}>

                    <DescriptionItem title="Proposal ID" content={item.proposalId}/>

                    </Row>
                    <Row key={item.proposalId}>

                        <DescriptionItem title="Proposal Amount" content={item.amount}/>

                    </Row>
                    <Row key={item.proposalId}>

                        <DescriptionItem title="Proposed Party" content={item.lenderNode}/>

                    </Row>
                    <Row key={item.proposalId}>

                        {this.getSyndicateButton(item.accepted, item.proposalId) }
                    </Row>


                    </Panel>)})
                    }


                </Collapse> :
                <Empty description="No proposals" imageStyle={{height: 60,}}/>
            }


            <Divider/>


            <p style={pStyle}>
                <Icon type="bank" theme="filled" /> {" "}
                Due Diligence Actions
            </p>

            <Row>
                <Col span={12}>
                    <DescriptionItem title="Verification Status" content={this.verificationStatus() } />
                </Col>
            </Row>


        </div>
    );
  }
}



export default ProposalDetails;

ProposalDetails.contextType=UserContext;

