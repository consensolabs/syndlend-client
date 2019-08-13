import React from 'react';
import { Skeleton, InputNumber, Row, Col, Button, Statistic, Table, Divider, Progress, Icon, Popover, Card } from 'antd';
import { connect } from 'react-redux';
import { LoanService } from '../services';
import {UserService} from "../services";
import {UserContext} from '../Context';


const loanService = new LoanService();
const userService = new UserService();


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
        {documents.map(document => {
          return (
            <span><a href=''>{document}</a><Divider type="vertical" /></span>
          );
        })}
      </span>
    ),
  },
];

const projectsData = [
  {
    key: '1',
    id: 'REF0023',
    lender: 'Agent 001',
    description: 'Pro Description',
    status: 'Issued'
  },
  {
    key: '2',
    id: 'REF0024',
    lender: 'Agent 002',
    description: 'Pro Description',
    status: 'Proposed'
  },
];

const projectCols = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Lender',
    dataIndex: 'lender',
    key: 'lender',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: status => (
      <span>
        <a href="">{status}</a>
      </span>
    )
  },
];


class Profile extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);


        this.state = {
            peers: [],
            cashBalance: '0 USD',
            me: '',
            popOverVisible: false,
            fundValue: 1000000,
            userInfospinning: true,
            userDetails: {},
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async componentWillMount() {

        while (!this.props.braidConnect.syndService) {
            console.log("waiting for connection: sleeping for 500 ms")
            await this.sleep(2000);
        }

        this.fetchPeerInfo();
        this.fetchAccountBalance();
        this.fetchUsersInfo(this.context.owningKey);


    }

    // Fetching user info from the centralized verification server
    fetchUsersInfo(sharedId) {
        userService.fetchUsersInfo(null, sharedId)
            .then(
                userList => {
                    console.log(userList);


                    this.setState({userDetails: userList.data[0], userInfospinning: false});
                },
                error => {
                    console.log("Error while fetching loans:", error);
                }
            );

    }


    fetchPeerInfo()
    {
        loanService.fetchPeers(this.props.braidConnect)
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
        loanService.fetchCashBalance(this.props.braidConnect, 'USD')
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
            <div>{this.state.peers.map((peer) => {return <p><Icon style={{ fontSize: '24px', color: '#08c' }}  type="bank"/>{peer}</p>})}
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

        loanService.selfIssueCash(this.props.braidConnect, parseInt(this.state.fundValue), 'USD')
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

    handleVisibleChange = popOverVisible => {
        this.setState({ popOverVisible });
    };





    render() {

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
            }}>{this.context.name}</span>
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
                      <Statistic title={"Account Balance (" + this.state.cashBalance.split(' ')[1]+ ")"} value={this.state.cashBalance.split(" ")[0]} precision={2} />
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
            <Button type="link" style={{float:'right',fontWeight:'500'}}>+ ADD A COLLATERAL</Button>
        </Col>
      </Row>
      <Row style={{ margin: '20px 0px' }}>
        <Col span={20}>
          <Table dataSource={collateralData} columns={collateralCols} />
        </Col>
      </Row>
      <Row style={{ margin: '20px 0px' }}>
        <Col span={10}>
            <h2>Projects</h2>
        </Col>
        <Col style={{float:'right'}}>
            <Button type="link" style={{float:'right',fontWeight:'500'}}>+ ADD A PROJECT</Button>
        </Col>
      </Row>
      <Row style={{ margin: '20px 0px' }}>
        <Col span={20}>
          <Table dataSource={projectsData} columns={projectCols} />
        </Col>
      </Row>
    </div>
  );
}
}

    const mapStateToProps = state => {
    return {
        activeRoleId: state.activeRoleId,
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
)(Profile);
Profile.contextType=UserContext;
