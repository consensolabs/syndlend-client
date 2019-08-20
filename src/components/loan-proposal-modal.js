import React from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import {
  Form,
  Select,
  InputNumber,
  DatePicker,
  Button,
  message,
} from 'antd';
import { LoanService } from '../services';
import {UserContext} from "../Context";

const { Option } = Select;

const loanService = new LoanService();

class loanProposalModal extends React.Component {

  constructor(props) {
    super(props);
    console.log(this.props)
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        loanService.createLendProposal(this.props.connection,this.props.loanInfo.loanId,values.amount)
          .then(
            response => {
              console.log("response:",response);
                message.loading('Creating the proposal:', 2)
                    .then(() => message.success('Proposal has been created, transaction ID: ' + response, 1));
              this.props.form.resetFields();
              this.props.handleOk();

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

          <Form.Item label="Available amount">
              <span className="ant-form-text"> {this.props.loanInfo.amount} Dollars </span>
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
                {getFieldDecorator('lock-date', config)(<DatePicker />)}
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24}}>
                <div style={{float: "right"}}>
                <Button type="secondary" onClick={e => { this.props.form.resetFields() }} style={{marginRight:'15px'}}>
                    CLEAR
                </Button>
                <Button type="primary" htmlType="submit">
                    SUBMIT REQUEST
                </Button>
                </div>
            </Form.Item>
      </Form>
    );
  }
}

const LoanProposalForm= Form.create({ name: 'validate_other' })(loanProposalModal);

export default LoanProposalForm;

LoanProposalForm.contextType=UserContext;
