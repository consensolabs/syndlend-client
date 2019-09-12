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





class ProjectDetails extends React.Component {

  constructor(props) {
    super(props);
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

                    <DescriptionItem title="Project ID" content={this.props.projectDetails.id}/>

            </Row>
            <Row>
                    <DescriptionItem title="Project Title" content={this.props.projectDetails.name}/>

            </Row>

            <Divider/>


            <p style={pStyle}>
                <Icon type="bank" theme="filled" /> {" "}
                Financial details
            </p>

            <Row>
                <DescriptionItem title="Projected Revenue" content={"$" + this.props.projectDetails.p_revenue + "million"}/>
            </Row>
            <Row>
                <DescriptionItem title="Projected Net Income" content={"$" + this.props.projectDetails.p_net_income + "million"}/>
            </Row>
            <Row>
                <DescriptionItem title="Projected Total Assets" content={"$" + this.props.projectDetails.p_total_assets + "million"}/>
            </Row>


        </div>
    );
  }
}



export default ProjectDetails;

ProjectDetails.contextType=UserContext;

