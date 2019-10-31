import React from 'react';
import 'antd/dist/antd.css';
import {
    Alert,
    Badge,
    Select,
    Icon,
    Spin,
    Collapse,
    Divider,
    Row
} from 'antd';
import { UserService } from '../services';
import {connect} from "react-redux";
import {UserContext} from "../Context";
import Transactions from "./transactions";

const userService = new UserService();

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





class LoanRequestDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        projectsData: [],
        projectInfospinning: true
    }
  }


  componentDidMount() {

      this.fetchProjectsInfo(this.props.loanRequestDetails.borrowerKey);



  }


    // Fetching user info from the centralized verification server
    fetchProjectsInfo(sharedId) {
        userService.fetchProjectsInfo(null, sharedId)
            .then(

                projectList =>
                {
                    this.setState({projectInfospinning: false});

                    if (projectList.meta.status) {


                        this.setState({projectsData: projectList.data});
                    }
                    else {
                        console.log("Error while fetching user   details:", projectList.meta.message);
                    }}
            ).catch(
            error => {
                console.log("Error while fetching project details:", error);
            });
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

                    <DescriptionItem title="Loan Request ID" content={this.props.loanRequestDetails.loanReqID}/>

            </Row>
            <Row>
                    <DescriptionItem title="Borrower Name" content={this.props.loanRequestDetails.companyName}/>

            </Row>

            <Divider/>


            <p style={pStyle}>
                <Icon type="bank" theme="filled" /> {" "}
                Loan details
            </p>

            <Row>
                <DescriptionItem title="Amount" content={"$ " + this.props.loanRequestDetails.amount}/>
            </Row>

            <Row>
                <DescriptionItem title="Interest Rate" content={this.props.loanRequestDetails.interestRate + " %"}/>
            </Row>

            <Row>
                <DescriptionItem title="Lock Date (Requested)" content={this.props.loanRequestDetails.lockDate}/>
            </Row>

            <Row>
                <DescriptionItem title="Loan Request Status" content={this.props.loanRequestDetails.status}/>
            </Row>

            <Divider/>


            <p style={pStyle}>
                <Icon type="bank" theme="filled" /> {" "}
                Project details
            </p>

            <Spin size="large" spinning={this.state.projectInfospinning}>

                    <div>
                        <Collapse>
                            <Panel header="Projects" extra={<Badge showZero count={this.state.projectsData.length} style={this.state.projectsData.length > 0 ? { backgroundColor: '#52c41a'} : { backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }} />}>



                                {this.state.projectsData.map((project) =>{
                                    return (
                                        <div>
                                            <Alert
                                                description={<span>
                    <Row>
                <DescriptionItem title="Projected Revenue" content={"$ " + project.p_revenue + " million"}/>
            </Row>
            <Row>
                <DescriptionItem title="Projected Net Income" content={"$ " + project.p_net_income + " million"}/>
            </Row>
            <Row>
                <DescriptionItem title="Projected Total Assets" content={"$ " + project.p_total_assets + " million"}/>
            </Row>
                        </span>}
                    type="success"

                            />
                        <br />
                    </div>

                            )



                                })
                                }
                            </Panel>
                        </Collapse>
                    </div>

            </Spin>


        </div>
    );
  }
}



export default LoanRequestDetails;

LoanRequestDetails.contextType=UserContext;

