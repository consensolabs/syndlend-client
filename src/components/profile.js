import React from 'react';
import { Row, Col, Button, Statistic, Table, Divider, Progress, Icon, Popover, Card } from 'antd';
import { connect } from 'react-redux';
import { LoanService } from '../services';


const loanService = new LoanService();


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

    constructor(props) {
        super(props);

        this.state = {
            peers: [],
            cashBalance: ''
        }
    }


    componentWillMount() {

        loanService.fetchPeers(this.props.braidConnect)
            .then(
                peers => {
                    this.setState({ peers: peers });
                },
                error => {
                    console.log("Error while peers info:", error);
                }
            );


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

    render() {

  return (
    <div>

      <h2>Profile</h2>
      <Row>
      <Col span={12}>
      <Row>
        <Col span={8}>
          <div style={{ margin: "1.25em 0em" }}>
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
      <Row style={{ margin: '20px 0px' }}>
        <Col span={4}>
          <div>
            <span style={{
              margin: "1em 0em",
              fontSize: "1.0em",
              fontWeight: 500
            }}>Company Name </span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span style={{
              margin: "1em 0em",
              fontSize: "1.0em",
              fontWeight: 400
            }}>Consenso Labs Pvt. Ltd. </span>
          </div>
        </Col>

      </Row>
      <Row style={{ margin: '20px 0px' }}>
        <Col span={4}>
          <div>
            <span style={{
              margin: "1em 0em",
              fontSize: "1.0em",
              fontWeight: 500
            }}>Contact </span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span style={{
              margin: "1em 0em",
              fontSize: "1.0em",
              fontWeight: 400
            }}>044-22364778 </span>
          </div>
        </Col>
      </Row>
      <Row style={{ margin: '20px 0px' }}>
        <Col span={4}>
          <div>
            <span style={{
              margin: "1em 0em",
              fontSize: "1.0em",
              fontWeight: 500
            }}>Address </span>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <span style={{
              margin: "1em 0em",
              fontSize: "1.0em",
              fontWeight: 400
            }}> {'Flat No: 234/1, 4th Floor, Go Spaze'} <br />  {'Siddhapura, Bangalore - 560038'} <br /> {'Karnataka, India'}</span>
          </div>
        </Col>
      </Row>
        <Row style={{ margin: '20px 0px' }}>
            <Col span={4}>
                <div>
            <span style={{
                margin: "1em 0em",
                fontSize: "1.0em",
                fontWeight: 500
            }}>Profile Strength </span>
                </div>
            </Col>
            <Col span={8}>
                <Progress type="circle" percent={75} width={80}/>
            </Col>
        </Row>
      </Col>
          <Col span={12}>
              <Row>
                  <Col span={8}>
                      <div style={{ margin: "1.25em 0em" }}>
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
              <div style={{ background: '#ECECEC', padding: '30px' }}>
              <Row gutter={16}>
                  <Popover content={this.peerInfo()} title="Peers in the network">
                  <Col span={12}>
                      <Button type="link" >
                      <Statistic title="Active Peers" value={this.state.peers.length} prefix={<Icon type="team" />} />
                      </Button>
                  </Col>
                  </Popover>
                  <Col span={12}>
                      <Statistic title={"Account Balance (" + this.state.cashBalance.split(' ')[1]+ ")"} value={this.state.cashBalance.split(" ")[0]} precision={2} />
                      <Button style={{ marginTop: 16 }} type="primary">
                          Fund account
                      </Button>
                  </Col>
              </Row>
              </div>

              <div style={{ background: '#ECECEC', padding: '30px' }}>
              <Row gutter={16}>

                  <Col span={12}>
                      <Card>
                          <Statistic
                              title="Active"
                              value={11.28}
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
                              title="Idle"
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
