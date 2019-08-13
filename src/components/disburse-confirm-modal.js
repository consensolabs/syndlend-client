import React from 'react';
import 'antd/dist/antd.css';
import {
  Select,
  Icon,
    Alert,
    Result,
    Spin,
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

const loanService = new LoanService();

const { Option } = Select;

const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

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
    }
  }

    componentDidUpdate(prevProps, prevState, snapshot) {


        if (prevProps !== this.props) {

            this.setState({
                loanDisbursed: false,
            });
        }
    }

    disburseLoan(loanId) {
      this.setState({spinning: true});
        loanService.disburseLoan(this.props.braidConnect, loanId)
            .then(
                response => {
                    console.log("Successully disbursed loan:", response);
                    this.setState({ loanDisbursed: true, spinning: false });
                },
                error => {
                    console.log("Error while fetching loans:", error);
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
            <Divider/>
            <Row>
            <div style={{float: "right"}}>
                <Button type="secondary" onClick={() => {this.disburseLoan(this.props.loanInfo.loanId)}} style={{marginRight:'15px'}}>
                    CANCEL
                </Button>
                <Button type="primary" onClick={() => {this.disburseLoan(this.props.loanInfo.loanId)}} style={{marginRight:'15px'}}>
                    ACCEPT
                </Button>
            </div>
            </Row>

        </div>
              </Spin>



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
)(DisburseConfirmDetails);

