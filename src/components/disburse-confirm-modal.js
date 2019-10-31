import React from 'react';
import 'antd/dist/antd.css';
import {
  Select,
    Alert,
    Result,
    Spin,
    Badge,
    message,
    Collapse,
    Divider,
    Button,
    Tag,
    Row,
    Col,
    Modal
} from 'antd';
import { LoanService } from '../services';
import {connect} from "react-redux";
import {UserContext} from "../Context";

const loanService = new LoanService();

const { Option } = Select;

const { Panel } = Collapse;

const confirm = Modal.confirm;

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





class DisburseConfirmDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        loanDisbursed: false,
        spinning: false,
        obligationInfo: {},
        paymentInfoLoading: true,
    }

    this.disburseLoanWithObligation = this.disburseLoanWithObligation.bind(this);

  }

   componentDidMount() {

       console.log("component mounted");

       if (!this.props.loanInfo.obligationId) {

           this.initiateLoanDisbursal(this.props.loanInfo);
       }

       else {
           this.fetchObligationInfo(this.props.loanInfo.obligationId)

       }
   }

    componentDidUpdate(prevProps, prevState, snapshot) {


      console.log(this.state);

      console.log(this.props.loanInfo.obligationId);


        if (prevProps.loanInfo.obligationId !== this.props.loanInfo.obligationId) {

            if (!this.props.loanInfo.obligationId) {

                this.initiateLoanDisbursal(this.props.loanInfo);
            }


                console.log(this.props.loanInfo.obligationId);
                this.fetchObligationInfo(this.props.loanInfo.obligationId);




            this.setState({
                loanDisbursed: false,
            });
        }

    }

    fetchObligationInfo(obligationId) {

        let context = this;

        context.setState({obligationInfo: []});
        loanService.fetchObligations(this.context.connection)
            .then(
                obligationList => {
                    obligationList.forEach((item) => {

                        if (item.obligationId === obligationId){
                            context.setState({paymentInfoLoading:false,
                                           obligationInfo: item})

                        }
                    });

                },
                error => {
                    console.log("Error while fetching loans:", error);
                }
            );
    }


    initiateLoanDisbursal(loanInfo)  {

        const rpc = this.context.connection;
        let context = this;

        confirm({
            title: `Payment isn't initiated yet, do you want begin`,
            okText: 'Confirm',
            onOk() {
                context.setState({paymentInfoLoading:true});
                loanService.createObligation(rpc, loanInfo.amount, 'OBLIGOR', loanInfo.borrowerNode, 10000)
                    .then(
                        response => {
                            context.setState({paymentInfoLoading:false,
                                obligationInfo: response.state.data});
                            context.disburseLoanWithObligation(context.props.loanInfo.loanId, response.state.data.linearId.id)
                        },
                        error => {
                            console.log("Error while fetching loans:", error);
                        }
                    );
            },
            onCancel() { },
        });
    };

    disburseLoanWithObligation( loanId, obligationId) {
        loanService.disburseLoanWithObligation(this.props.connection, loanId, obligationId)
            .then(
                response => {
                    console.log("Successfully added obligation to loan:", response);
                    this.setState({spinning: false });
                },
                error => {
                    console.log("Error while adding obligation to loan:", error);
                }
            );
    }


    disburseLoan(loanId) {
      this.setState({spinning: true});
        loanService.settleObligation(this.props.connection, this.state.obligationInfo.amount, this.state.obligationInfo.obligationId)
            .then(
                response => {
                    console.log("Successfully settled obligation:", response);
                    this.setState({ loanDisbursed: true, spinning: false });
                },
                error => {
                    console.log("Error while settling obligation:", error);
                }
            );
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
          this.state.loanDisbursed ?
              <Result
                  status="success"
                  title="Successfully paid the loan amount to the borrower"
                  subTitle="Transaction ID: 2017182818828182881"
              /> :
              <Spin size="large" spinning={this.state.spinning}>
        <div>
            <Alert
                message="Please confirm the loan details before paying the borrower"
                // description="Please confirm the loan details before paying the borrower"
                type="info"
                showIcon
            />

            <Row>

                    <DescriptionItem title="Loan ID" content={this.props.loanInfo.loanId}/>

            </Row>
            <Row>
                    <DescriptionItem title="Borrower Name" content={this.props.loanInfo.borrowerNode}/>

            </Row>
            <Row>

                    <DescriptionItem title="Amount" content={this.props.loanInfo.amount} />

            </Row>
            <Spin size="large" spinning={this.state.paymentInfoLoading}>

                { this.state.obligationInfo.settlementMethod ?
                    <div>
                    <Alert
                        message="Payment Method"
                        description={<span>

                                        <Row>

                                            <DescriptionItem title="Settlement Type" content={this.state.obligationInfo.settlementMethod._type} />

                                        </Row>

                                        <Row>

                                            <DescriptionItem title="Receiving Address" content={this.state.obligationInfo.settlementMethod.accountToPay} />

                                        </Row>

                                    </span>
                                    }
                        type="success"
                    />
                    <br/>

                    <Collapse>
                    <Panel header="Payments" extra={<Badge showZero count={this.state.obligationInfo.payments.length} style={this.state.obligationInfo.payments.length > 0 ? { backgroundColor: '#52c41a'} : { backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }} />}>



                        {this.state.obligationInfo.payments.map((payment) =>{
                            return (
                                <div>
                                    <Alert
                                        description={<span>
                    <Row>
                        <DescriptionItem title="Amount" content={payment.amount.quantity * payment.amount.displayTokenSize + " "+ payment.amount.token.tokenIdentifier}/>

                    </Row>
                    <Row>
                        <DescriptionItem title="Status" content={payment.status} />

                    </Row>
                    <Row>
                        <DescriptionItem title="Reference" content={<a target="_blank" href={"https://test.bithomp.com/explorer/"+ payment.paymentReference}>{payment.paymentReference}</a>} />

                    </Row>
                        </span>}
                                        type={payment.status === "SETTLED" ? "success" : "warning"}
                                        showIcon
                                    />
                                    <br />
                                </div>

                            )



                        })
                }
                    </Panel>
                    </Collapse>
                    </div>

                    :
                    <Alert description= "No payment method found" type="warning" showIcon/>
                }

            </Spin>

            <Divider/>
            <Row>
            <div style={{float: "right"}}>
                <Button type="secondary" onClick={() => {}} style={{marginRight:'15px'}}>
                    CANCEL
                </Button>
                <Button type="primary" disabled={!this.state.obligationInfo.settlementMethod} onClick={() => {this.disburseLoan(this.props.loanInfo.loanId)}} style={{marginRight:'15px'}}>
                    DIBURSE LOAN
                </Button>
            </div>
            </Row>

            </div>
      </Spin>




    );
  }
}

export default DisburseConfirmDetails;

DisburseConfirmDetails.contextType=UserContext;

