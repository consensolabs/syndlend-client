import React from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import {
  Form,
  Select,
  InputNumber,
  DatePicker,
  Button,
} from 'antd';
import { LoanService } from '../services';
import {message} from "antd/lib/index";
import {UserContext} from "../Context";

const { Option } = Select;

const loanService = new LoanService();

class loanRequestForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        confirmLoading: false,
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        console.log(values.lockdate.format("YYYY-MM-DD hh:mm:ss"));

        loanService.createLoanRequest(this.props.connection, values.bank, values.amount, values.interest, values.lockdate.format("YYYY-MM-DD hh:mm:ss"))
          .then(
            response => {
              console.log("response:",response);
                this.setState({
                    confirmLoading: true,
                });
                setTimeout(() => {
                    this.setState({
                        confirmLoading: false,
                    });
                    message.success('Loan request has been created successfully ', 1);
                    this.props.form.resetFields();
                    this.props.handleOk();
                }, 2000);

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
    const config = {
        rules: [{ type: 'object', message: 'Please select date!' }],
      };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>

            <Form.Item label="Project" hasFeedback>
                {getFieldDecorator('project', {
                    rules: [{ required: true, message: 'Please select Project!' }],
                })(
                    <Select placeholder="Select a project">
                        <Option value="proa">Project A</Option>
                        <Option value="prob">Project B</Option>
                    </Select>,
            )}
            <Button type="link" style={{float:'right',fontWeight:'500'}}>+ ADD NEW PROJECT</Button>
            </Form.Item>

            <Form.Item label="Amount">
                {getFieldDecorator('amount', {rules: [{ required: true, message: 'Please provide Amount!' }] })(<InputNumber />)}
                <span className="ant-form-text"> Dollars </span>
            </Form.Item>

            <Form.Item label="Interest Rate Expected">
                {getFieldDecorator('interest', { initialValue: 13 })(<InputNumber min={1} max={100} />)}
                <span className="ant-form-text"> % </span>
            </Form.Item>

            <Form.Item label="Lock Date (Expected)">
                {getFieldDecorator('lockdate', config)(<DatePicker format={"YYYY-MM-DD"} />)}
            </Form.Item>

            <Form.Item label="Arranger Bank" hasFeedback>
                {getFieldDecorator('bank', {
                    rules: [{ required: true, message: 'Please select Bank!' }],
                })(
                    <Select placeholder="Select a bank">
                        {this.props.peers.map((peer) => {return(<Option value={peer}>{peer}</Option>)})}
                    </Select>
                )}
            </Form.Item>

            <Form.Item label="Collateral" hasFeedback>
                {getFieldDecorator('collateral', {
                    rules: [{ required: true, message: 'Please select Collateral!' }],
                })(
                    <Select placeholder="Select a collateral">
                        <Option value="cola">Collateral A</Option>
                        <Option value="colb">Collateral B</Option>
                    </Select>,
                )}
                <Button type="link" style={{float:'right',fontWeight:'500'}}>+ ADD NEW COLLATERAL</Button>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24}}>
                <div style={{float: "right"}}>
                <Button type="secondary" onClick={e => { this.props.form.resetFields() }} style={{marginRight:'15px'}}>
                    CLEAR
                </Button>
                <Button type="primary" htmlType="submit" loading={this.state.confirmLoading}>
                    SUBMIT REQUEST
                </Button>
                </div>
            </Form.Item>
      </Form>
    );
  }
}

const LoanReqFormWrapper = Form.create({ name: 'validate_other' })(loanRequestForm);

export default LoanReqFormWrapper;

LoanReqFormWrapper.contextType=UserContext;
