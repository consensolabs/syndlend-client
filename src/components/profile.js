import React from 'react';
import { Modal, Skeleton, InputNumber, Row, Col, Button, Statistic, Table, Divider, Progress, Icon, Popover, Card } from 'antd';
import { connect } from 'react-redux';
import { LoanService } from '../services';
import {UserService} from "../services";
import {UserContext} from '../Context';
import AddProjectForm from "./add-project-modal";
import ProjectDetails from "./project-details-modal";
import {RippleService} from "../services/ripple.service";


const loanService = new LoanService();
const userService = new UserService();
const rippleService = new RippleService();


const collateralData = [
  {
    key: '1',
    asset: 'REC 001',
    description: 'Description REC 001',
    documents: ['DOC 001.pdf', 'DOC 002.pdf', 'DOC 003.pdf'],
  },
  {
    key: '2',
    asset: 'REC 002',
    description: 'Description REC 002',
    documents: ['DOC 004.pdf', 'DOC 005.pdf'],
  },
];

const collateralCols = [
  {
    title: 'Asset',
    dataIndex: 'asset',
    key: 'asset',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Documents',
    dataIndex: 'documents',
    key: 'documents',
    render: documents => (
      <span>
        {documents.map((document, index) => {
            return (
                <span key={index}><a href=''>{document}</a><Divider type="vertical" /></span>
            );
        })}
      </span>
    ),
  },
];


class Profile extends React.Component {

    static contextType = UserContext;


    constructor(props) {
        super(props);



        this.state = {
            peers: [],
            cashBalance: '0 USD',
            xrpAccountDetails: {},
            me: '',
            popOverVisible: false,
            fundValue: 1000000,
            userInfospinning: true,
            userDetails: {},
            projectsData: [],
            projectDetails: {},
            projctInfospinning: true,
            showAddProjectForm: false,
            showProjectDetailsModal: false
        }
    }


    async componentWillMount() {

        this.fetchPeerInfo();
        this.fetchAccountBalance();
        this.fetchUsersInfo(this.context.me.owningKey);
        this.fetchProjectsInfo(this.context.me.owningKey);

        await rippleService.connect();
        if (rippleService.api.isConnected()) {
            rippleService.fetchAccountInfo().then((info) => {

                console.log(info);

                this.setState({xrpAccountDetails: info});

            });
        }


    }

    // Fetching user info from the centralized verification server
    fetchUsersInfo(sharedId) {
        userService.fetchUsersInfo(null, sharedId)
            .then(
                userList => {
                    if (userList.meta.status) {


                    this.setState({userDetails: userList.data[0], userInfospinning: false});
                }
                else {
                    console.log("Error while fetching user details:", userList.meta.message);
                }}
            ).catch(
                error => {
                    console.log("Error while fetching user details:", error);
                });

    }


    // Fetching user info from the centralized verification server
    fetchProjectsInfo(sharedId) {
        userService.fetchProjectsInfo(null, sharedId)
            .then(
                projectList =>
                {
                    if (projectList.meta.status) {


                        this.setState({projectsData: projectList.data, projctInfospinning: false});
                    }
                    else {
                        console.log("Error while fetching user details:", projectList.meta.message);
                    }}
            ).catch(
            error => {
                console.log("Error while fetching project details:", error);
            });
    }


    fetchPeerInfo()
    {
        loanService.fetchPeers(this.context.connection)
            .then(
                peers => {
                    this.setState({ peers: peers });
                },
                error => {
                    console.log("Error while peers info:", error);
                }
            );
    }

    fetchAccountBalance()
    {
        loanService.fetchCashBalance(this.context.connection, 'USD')
            .then(
                cashBalance => {
                    this.setState({ cashBalance: cashBalance });
                },
                error => {
                    console.log("Error while peers info:", error);
                }
            );

    }

    peerInfo() {
        return(
            <div>{this.state.peers.map((peer, index) => {return <p key={index}><Icon style={{ fontSize: '24px', color: '#08c' }}  type="bank"/>{peer}</p>})}
            </div>
        )

    }

    fundAccountForm() {
        return(

            <div>
                <p>
                    Enter an amount to fund
                </p>
                <InputNumber
                    defaultValue={1000000}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    onChange={(value)=>{this.setState({fundValue:value})}}
                />

            <div style={{float: "right"}}>
            <Button type="primary" onClick={() => {this.fundAccount()}}>
                    FUND
            </Button>
            </div>

            </div>

        )


    }

    fundAccount = () => {
        console.log(this.state.fundValue);

        loanService.selfIssueCash(this.context.connection, parseInt(this.state.fundValue), 'USD')
            .then(
                response => {
                    console.log("Successfully issued cash:", response);
                    this.fetchAccountBalance();
                },
                error => {
                    console.log("Error while peers info:", error);
                }
            );
        this.setState({
            popOverVisible: false,
        });
    };


    showAddProjectModal = () => {
        this.setState({
            showAddProjectForm: true
        });
    };

    showProjectDetailsModal = (record) => {
        this.setState({
            showProjectDetailsModal: true,
            projectDetails: record
        });
    };

    handleOk = e => {
        this.setState({
            showAddProjectForm: false,
            showProjectDetailsModal: false
        });
        this.fetchProjectsInfo(this.context.me.owningKey);
    };

    handleCancel = e => {
        this.setState({
            showAddProjectForm: false,
            showProjectDetailsModal: false
        });
    };

    handleVisibleChange = popOverVisible => {
        this.setState({ popOverVisible });
    };





    render() {

        const projectCols = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: 'Title',
                dataIndex: 'name',
                key: 'name',
                render: (name, record) => (
                    <Button type="link"  onClick={() => {this.showProjectDetailsModal(record);}}>{name}</Button>
                )
            },
            {
                title: 'Projected Net Income',
                dataIndex: 'p_net_income',
                key: 'p_net_income',
            },
            {
                title: 'Started',
                dataIndex: 'created',
                key: 'created',
            },
        ];


        return (
    <div>

      <h2>Profile</h2>
      <Row>
      <Col span={12}>

                  <Row>
                      <Col span={8}>
                          <div style={{margin: "1.25em 0em"}}>
            <span style={{
                fontSize: "1.25em",
                fontWeight: 500
            }}>Basic Details
            <Button
                type="link"
                icon="edit"
            >
              </Button>
            </span>
                          </div>
                      </Col>
                  </Row>
          {this.state.userInfospinning ?
              <div><Skeleton active/> <Skeleton active/></div>:
              <div>
                  <Row style={{margin: '20px 0px'}}>
                      <Col span={4}>
                          <div>
            <span style={{
                margin: "1em 0em",
                fontSize: "1.0em",
                fontWeight: 500
            }}><Icon type="bank" theme="filled"/> Company Name </span>
                          </div>
                      </Col>
                      <Col span={8}>
                          <div>
            <span style={{
                margin: "1em 0em",
                fontSize: "1.0em",
                fontWeight: 400
            }}>{this.state.userDetails.username}</span>
                          </div>
                      </Col>

                  </Row>
                  <Row style={{margin: '20px 0px'}}>
                      <Col span={4}>
                          <div>
            <span style={{
                margin: "1em 0em",
                fontSize: "1.0em",
                fontWeight: 500
            }}><Icon type="phone" theme="filled"/> Contact </span>
                          </div>
                      </Col>
                      <Col span={8}>
                          <div>
            <span style={{
                margin: "1em 0em",
                fontSize: "1.0em",
                fontWeight: 400
            }}>{this.state.userDetails.contact} </span>
                          </div>
                      </Col>
                  </Row>
                  <Row style={{margin: '20px 0px'}}>
                      <Col span={4}>
                          <div>
            <span style={{
                margin: "1em 0em",
                fontSize: "1.0em",
                fontWeight: 500
            }}><Icon type="home" theme="filled"/> Address </span>
                          </div>
                      </Col>
                      <Col span={8}>
                          <div>
            <span style={{
                margin: "1em 0em",
                fontSize: "1.0em",
                fontWeight: 400
            }}> {this.state.userDetails.address} <br/> {this.state.userDetails.nationality}</span>
                          </div>
                      </Col>
                  </Row>
                  <Row style={{margin: '20px 0px'}}>
                      <Col span={4}>
                          <div>
            <span style={{
                margin: "1em 0em",
                fontSize: "1.0em",
                fontWeight: 500
            }}><Icon type="fire" theme="filled"/> Profile Strength </span>
                          </div>
                      </Col>
                      <Col span={8}>
                          <Progress type="circle" percent={this.state.userDetails.profile_strength} width={80}/>
                      </Col>
                  </Row>
              </div>
          }
      </Col>




          <Col span={12}>
              <Row>
                  <Col span={8}>
                      <div style={{ margin: "1.25em 0em" }}>
            <span style={{
                fontSize: "1.25em",
                fontWeight: 500
            }}>Account Details
            <Button
                type="link"
                icon="edit"
            >
              </Button>
            </span>
                      </div>
                  </Col>
              </Row>

          <div style={{ background: '#ECECEC', padding: '30px' }}>

          <Row style={{ margin: '20px 0px' }}>
          <Col span={12}>
                      <div>
            <span style={{
                margin: "1em 0em",
                fontSize: "1.0em",
                fontWeight: 500
            }}>Name </span>
                      </div>
                  </Col>
                  <Col span={12}>
                      <div>
            <span style={{
                margin: "1em 0em",
                fontSize: "1.0em",
                fontWeight: 400
            }}>{this.context.me.name}</span>
                      </div>
                  </Col>

              </Row>

              <Row gutter={16}>
                  <Popover content={this.peerInfo()} title="Peer Info">
                  <Col span={12}>
                      <Button type="link" >
                      <Statistic title="Active Peers" value={this.state.peers.length} prefix={<Icon type="team" />} />
                      </Button>
                  </Col>
                  </Popover>
                  <Col span={12}>
                      <Statistic title={"Token Account Balance (" + this.state.cashBalance.split(' ')[1]+ ")"} value={this.state.cashBalance.split(" ")[0]} precision={2} />
                      <Statistic title={"XRP Account Balance (XRP)"} value={this.state.xrpAccountDetails.xrpBalance} precision={2} />
                          <Popover
                              content={this.fundAccountForm()}
                              title="Fund Account"
                              trigger="click"
                              visible={this.state.popOverVisible}
                              onVisibleChange={this.handleVisibleChange}
                          >

                      <Button style={{ marginTop: 16 }} type="primary">
                          Fund account
                      </Button>
                          </Popover>

                      <Button type="primary" onClick={() => {this.fetchAccountBalance()  }} shape="circle" icon="reload" size={'small'} style={{ marginLeft: 15, marginTop: 16 }} />


                  </Col>
              </Row>
              </div>

              <div style={{ background: '#ECECEC', padding: '30px' }}>
              <Row gutter={16}>

                  <Col span={12}>
                      <Card>
                          <Statistic
                              title="Loans Accepted"
                              value={70.28}
                              precision={2}
                              valueStyle={{ color: '#3f8600' }}
                              prefix={<Icon type="arrow-up" />}
                              suffix="%"
                          />
                      </Card>
                  </Col>
                  <Col span={12}>
                      <Card>
                          <Statistic
                              title="Activity"
                              value={9.3}
                              precision={2}
                              valueStyle={{ color: '#cf1322' }}
                              prefix={<Icon type="arrow-down" />}
                              suffix="%"
                          />
                      </Card>
                  </Col>

              </Row>
              </div>


          </Col>
      </Row>

      <Row style={{ margin: '20px 0px' }}>
        <Col span={10}>
            <h2>Collaterals</h2>
        </Col>
        <Col style={{float:'right'}}>
            <Button type="link" style={{float:'right',fontWeight:'500'}} onClick={() => {this.showAddProjectModal();}}>+ ADD A COLLATERAL</Button>
        </Col>
      </Row>
      <Row style={{ margin: '20px 0px' }}>
        <Col span={20}>
          <Table
              dataSource={collateralData}
              columns={collateralCols}
              pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20', '30'] }}
          />
        </Col>
      </Row>
      <Row style={{ margin: '20px 0px' }}>
        <Col span={10}>
            <h2>Projects</h2>
        </Col>
        <Col style={{float:'right'}}>
            <Button type="link" style={{float:'right',fontWeight:'500'}} onClick={() => {this.showAddProjectModal();}}>+ ADD A PROJECT</Button>
        </Col>
      </Row>
      <Row style={{ margin: '20px 0px' }}>
        <Col span={20}>
          <Table
              dataSource={this.state.projectsData}
              columns={projectCols}
              pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15', '20', '30'] }}
          />
        </Col>
      </Row>
        <Modal
            title="Add a Project"
            visible={this.state.showAddProjectForm}
            onOk={this.handleOk}
            footer={null}
            onCancel={this.handleCancel}
            >

        <AddProjectForm handleOk={this.handleOk} me={this.context.me}/>

    </Modal>
    <Modal
        title="Project Details"
        visible={this.state.showProjectDetailsModal}
        onOk={this.handleOk}
        footer={null}
        onCancel={this.handleCancel}
    >

        <ProjectDetails projectDetails={this.state.projectDetails} handleOk={this.handleOk} me={this.context.me}/>

    </Modal>

    </div>
  );
}
}

    const mapStateToProps = state => {
    return {
        activeRoleId: state.activeRoleId,
    };
};

    const mapDispatchToProps = dispatch => {
    return {};
};

    export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);
Profile.contextType=UserContext;
