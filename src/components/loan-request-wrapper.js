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

const { Option } = Select;

const loanService = new LoanService();

class loanRequestForm extends React.Component {

  constructor(props) {
    super(props);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        loanService.createLoanRequest(this.props.braidConnect,values.bank,values.amount,"Consenso Labs")
          .then(
            response => {
              console.log("response:",response)
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
                {getFieldDecorator('lock-date', config)(<DatePicker />)}
            </Form.Item>

            <Form.Item label="Arranger Bank" hasFeedback>
                {getFieldDecorator('bank', {
                    rules: [{ required: true, message: 'Please select Bank!' }],
                })(
                    <Select placeholder="Select a bank">
                        <Option value="O=Agent Bank,L=Mumbai,C=IN">Bank A</Option>
                        <Option value="O=Agent Bank,L=Bangalore,C=IN">Bank B</Option>
                    </Select>,
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

            <Form.Item wrapperCol={{ span: 12, offset: 12 }}>
                <Button type="secondary" onClick={e => { this.props.form.resetFields() }} style={{marginRight:'15px'}}>
                    CLEAR
                </Button>
                <Button type="primary" htmlType="submit">
                    SUBMIT REQUEST
                </Button>
            </Form.Item>
      </Form>
    );
  }
}

const LoanReqFormWrapper = Form.create({ name: 'validate_other' })(loanRequestForm);

const mapStateToProps = state => {
  return {
    braidConnect: state.braidConnect
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanReqFormWrapper);