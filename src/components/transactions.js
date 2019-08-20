import React from "react";
import {  Spin, Empty, Card, Collapse, Icon, Row, Col, Tag } from "antd";
import { connect } from 'react-redux';
import { LoanService } from '../services';
import {UserContext} from "../Context";

const loanService = new LoanService();

const { Panel } = Collapse;

const customPanelStyle = {
    background: '#ECECEC',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden',
};

const gridStyle = {
    width: '100%',
    textAlign: 'center',
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

class Transactions extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            transactionList: [],
            spinning: true,
        }
    }

    componentDidMount() {

        this.fetchTransactions();
    }

    fetchTransactions() {
        loanService.fetchTransactions(this.context.connection)
            .then(
                transactions => {
                    this.setState({ transactionList: transactions, spinning: false });
                    console.log(transactions);

                },
                error => {
                    console.log("Error while fetching loans:", error);
                }
            );
    }

    getAdditionInfo(inputCount, outputCount) {
        return (
            <div>
                <Tag style={{fontWeight: '500', cursor: 'pointer' }} color={"geekblue"}>
                    <Icon type="arrow-down" /> INPUTS: {inputCount}
                </Tag>

                <Tag style={{fontWeight: '500', cursor: 'pointer' }} color={"geekblue"}>
                    <Icon type="arrow-up" /> OUTPUTS: {outputCount}
                </Tag>
            </div>
        )

    }

    render() {
        return (

            <Spin size="large" spinning={this.state.spinning}>

            <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0}/>}
        >

            {this.state.transactionList.map( (item) => {
                return(

                    <Panel header={item.hash} key={item.hash} style={customPanelStyle}  extra={this.getAdditionInfo(item.inputs.length, item.outputs.length )}>

                        <div style={{ background: '#ECECEC', padding: '30px' }}>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Card title={<span><Icon type="arrow-down" style={{ color: '#3f8600' }} /> INPUTS</span>} bordered={false} >
                                        {

                                            item.inputs.length ?
                                            item.inputs.map( (input) =>
                                             <Card.Grid style={gridStyle}><Icon type="file-text" style={{color: '#454545'}}/> {input}</Card.Grid>

                                            ) :
                                                <span style={{color: '#d7d8d5'}}> <Icon type="file-exclamation" style={{color: '#d7d8d5'}}/> No Inputs </span>
                                        }
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card title={<span><Icon type="arrow-up" style={{ color: '#cf1322' }}/> OUTPUTS</span>} bordered={false} >
                                        {
                                            item.outputs.length ?
                                            item.outputs.map( (input) =>
                                            <Card.Grid style={gridStyle}> <Icon type="file-text" style={{color: '#454545'}}/> {input}</Card.Grid>

                                        ) :
                                                <span> <Icon type="file-exclamation" style={{color: '#454545'}}/> No Inputs </span>
                                        }
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card title={<span><Icon type="team" /> SIGNERS</span>} bordered={false} >
                                        { item.signers.map( (input) =>
                                            <Card.Grid style={gridStyle}>
                                                <Icon type="bank" theme="filled" /> {input}
                                            </Card.Grid>

                                        )
                                        }
                                    </Card>
                                </Col>
                            </Row>
                        </div>



                    </Panel>)})
            }


        </Collapse>
            </Spin>
        );
    }
}

export default Transactions;
Transactions.contextType=UserContext;
