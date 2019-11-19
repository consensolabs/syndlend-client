import React from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import {
  Form,
  Select,
  Row,
  Input,
  Button,
  Alert,
  Collapse
} from 'antd';
import { LoanService } from '../services';
import {message} from "antd/lib/index";
import {UserContext} from "../Context";

const { Panel } = Collapse;

const { Option } = Select;

const loanService = new LoanService();



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

const paymentMethods = ["XRP", "SWIFT", "Tokens", "Manual"]


class DisbursalSettings extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        paymentMethod: 'XRP',
        confirmLoading: false,
    }
  }



  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
          this.setState({
              confirmLoading: true,
          });

          loanService.novateObligation(this.props.connection, this.props.obligationInfo.obligationId, values.oracle)
          .then(
            response => {
              console.log("response:",response);

                    loanService.updatePaymentMethod(this.props.connection, this.props.obligationInfo.obligationId, values.address, values.oracle)
                        .then(
                            response => {
                                setTimeout(() => {
                                        this.setState({
                                            confirmLoading: false,
                                        });
                                        message.success('Payment method updated successfully ', 1);
                                        this.props.form.resetFields();
                                        this.props.handleOk();
                                }, 1000);

                                console.log("response:",response);
                            },
                            error => {
                                console.log("Error while creating Loan Request:", error);
                            }
                        );


            },
            error => {
              console.log("Error while creating Loan Request:", error);
            }
          );


      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
        this.props.obligationInfo.settlementMethod ?
            <div>
                <Row>
                    <DescriptionItem title="Lender Name" content={this.props.obligationInfo.lenderNode}/>

                </Row>
                <Row>

                    <DescriptionItem title="Amount" content={this.props.obligationInfo.amount} />

                </Row>

            <Alert
                message="Payment Method"
                description={<span>

                <Row>

                    <DescriptionItem title="Settlement Type" content={this.props.obligationInfo.settlementMethod._type} />

                </Row>

                <Row>

                    <DescriptionItem title="Receiving Address" content={this.props.obligationInfo.settlementMethod.accountToPay} />

                </Row>

            </span>}
                type="success"
            />
            <br/>

                <Collapse>
                    <Panel header="Payments">



                {this.props.obligationInfo.payments.map((payment) =>{
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
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>

          <Row>
              <DescriptionItem title="Lender Name" content={this.props.obligationInfo.lenderNode}/>

          </Row>
          <Row>

              <DescriptionItem title="Amount" content={this.props.obligationInfo.amount} />

          </Row>

          <Form.Item label="Payment method" hasFeedback labelAlign="left">
              {getFieldDecorator('paymentMethod', {
                  initialValue: this.state.paymentMethod,
                  rules: [{ required: true, message: 'Select a payment method!' }],
              })(
                  <Select placeholder="Select a bank" onChange={(method) => {this.setState({paymentMethod: method})}}>
                      {paymentMethods.map((paymentMethod) => {return(<Option value={paymentMethod}>{paymentMethod}</Option>)})}
                  </Select>
              )}
          </Form.Item>
          {this.state.paymentMethod === "XRP" ?
              <div>

                  <Form.Item label="Receiving XRP address" labelAlign="left">
                      {getFieldDecorator('address', {
                          initialValue: 'rawuE2jrw7hJtmjasyse6Jy7Mma3iBCzco',
                          rules: [{required: true, message: 'Please input receiving XRP address!'}],
                      })(<Input/>)}
                  </Form.Item>


                  <Form.Item label="Oracle" hasFeedback labelAlign="left">
                      {getFieldDecorator('oracle', {
                          rules: [{required: true, message: 'Please an Oracle!'}],
                      })(
                          <Select placeholder="Select a bank">
                              {this.props.peers.map((peer) => {
                                  return (<Option value={peer}>{peer}</Option>)
                              })}
                          </Select>
                      )}
                  </Form.Item>
              </div> :

              <div/>
          }


            <Form.Item wrapperCol={{ span: 24}}>
                <div style={{float: "right"}}>
                <Button type="secondary" onClick={e => { this.props.form.resetFields() }} style={{marginRight:'15px'}}>
                    CLEAR
                </Button>
                <Button type="primary" htmlType="submit" loading={this.state.confirmLoading}>
                    SUBMIT
                </Button>
                </div>
            </Form.Item>
      </Form>
    );
  }
}

const DisbursalSettingsForm = Form.create({ name: 'validate_other' })(DisbursalSettings);

export default DisbursalSettingsForm;

DisbursalSettingsForm.contextType=UserContext;
