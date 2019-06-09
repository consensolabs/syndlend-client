
import React from 'react';
import 'antd/dist/antd.css';
import {
  Form,
  Select,
  InputNumber,
  DatePicker,
  Button,
} from 'antd';

const { Option } = Select;

class loanRequestForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
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
                        <Option value="bank0">Bank A</Option>
                        <Option value="bank1">Bank B</Option>
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

            <Form.Item wrapperCol={{ span: 8, offset: 16 }}>
                <Button type="primary" htmlType="submit">
                    SUBMIT REQUEST
                </Button>
            </Form.Item>
      </Form>
    );
  }
}

const LoanReqFormWrapper = Form.create({ name: 'validate_other' })(loanRequestForm);

export default LoanReqFormWrapper;
