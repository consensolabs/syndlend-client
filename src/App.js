import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Menu, Dropdown, Layout, Modal, Icon, Spin, Alert, Row } from "antd";
import Dashboard from './components/dashboard.js';
import Menubar from './components/menubar.js';
import Profile from './components/profile.js';
import Transactions from './components/transactions.js';
import SideMenuBar from "./components/side-menubar.js";
import PageNotFoundError from './components/404.js';
import "antd/dist/antd.css";
import "./App.css";
import {UserContext} from './Context';
import {LoanService} from './services/loan.service';
import {connect} from "react-redux";
import {setActiveRole} from "./actions";
import {BraidService} from './services/braid.service';

const loanService = new LoanService();
const braidService = new BraidService();

const { Header, Content } = Layout;

class App extends React.Component {

  contextData = {};

  constructor(props) {
    super(props);

    this.nodeInfo = {};

    this.state = {
        nodeSelected: false,
        login: false,
        confirmLoading: false,
        me: {},
        contextData: {},
        loading: true,
    }
  }

  componentDidMount() {

      const nodeInfo = JSON.parse(localStorage.getItem('nodeInfo'));
      if (nodeInfo) {
          this.autoLogin(nodeInfo);
      }
  }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async fetchMyInfo() {
      this.setState({loading: true});

      loanService.myInfo(braidService.connection)
          .then(
              me => {
                  this.contextData["me"] = me;
                  this.setState({ me: me,
                      loading: false});

              },
              error => {
                  console.log("Error while peers info:", error);
              }
          );
  }
    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });
        setTimeout(() => {

            // Setting the user session
            localStorage.setItem('nodeInfo', JSON.stringify(this.nodeInfo));

            this.setState({
                visible: false,
                confirmLoading: false,
                login: true,
            });
        }, 1000);
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    toggleSideMenu = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    async onNodeChange (url, role) {

        this.setState({loading: true, nodeSelected: true});
        this.nodeInfo = {"url": url, "role": role};

        braidService.connect(url);
        while (!braidService.connected) {
            console.log("waiting for connection: sleeping for 100 ms")
            await this.sleep(100);
        }

        this.contextData["connection"] = braidService.connection;

        this.fetchMyInfo();

    }

    async autoLogin (nodeInfo) {

        this.setState({loading: true, nodeSelected: true});

        braidService.connect(nodeInfo.url);
        while (!braidService.connected) {
            console.log("waiting for connection: sleeping for 100 ms")
            await this.sleep(100);
        }

        this.contextData["connection"] = braidService.connection;

        await this.fetchMyInfo();
        this.setState({login:true});
        this.props.onRoleChange(nodeInfo.role)

    }



    getNodes= () =>{
        let nodeList = [{name:"Borrower node",url: "http://localhost:8001/api/", roleId: "0"},
            {name:"Agent node",url: "http://localhost:8002/api/", roleId: "1"},
            {name:"Lender node",url: "http://localhost:8003/api/", roleId: "2"}];
        return(
            <Menu onClick={({item})=>{console.log(item);this.onNodeChange(item.props.url, item.props.roleId);this.props.onRoleChange(item.props.roleId);}}>
                {
                    nodeList.map((node) =><Menu.Item key={node.name} url={node.url} roleId={node.roleId}>{node.name}</Menu.Item>)
                }
            </Menu>);
    };

    showConfirm() {
      return(
        <Modal
            title={<div><Row className="syndlend-logo" /><Row span={12} style={{marginLeft: 18}}>User Login</Row></div>}
            visible={!this.state.login}
            onOk={this.handleOk}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel} >


            <Dropdown overlay={this.getNodes()}>
                <a className="ant-dropdown-link" href="#">
                    Select a node to connect <Icon type="down" />
                </a>
            </Dropdown>

            {this.state.nodeSelected?

            <div>

                <Spin spinning={this.state.loading}>
                <Alert
                    message="You are logged in as:"
                    description={<span><Icon style={{ fontSize: '24px', color: '#08c' }}  type="bank"/> {this.state.me.name} </span>}
                    type="info"
                    showIcon
                />
                </Spin>

                Do you want to continue?

            </div> :

            <Alert
                    message="Selected a node"
                    // description={<span><Icon style={{ fontSize: '24px', color: '#08c' }}  type="bank"/> {this.state.me.name} </span>}
                    type="warning"
                    showIcon
            />


            }



        </Modal>
      );
    }

  render() {

        console.log("inside render", this.contextData);

    return (
        this.state.login && ! this.state.loading?
            <UserContext.Provider value={this.contextData}>
                <BrowserRouter>
                    <Layout>
                        <Menubar/>
                        <Layout>
                            <SideMenuBar collapsed={this.state.collapsed}/>
                            <Layout>
                                <Header style={{ background: '#fff', paddingLeft: 20, height: 50 }}>
                                    <Icon
                                        className="trigger"
                                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                        onClick={this.toggleSideMenu}
                                    />
                                </Header>

                                <Content style={{
                                    background: "#fff",
                                    padding: 24,
                                    margin: '24px 16px',
                                    minHeight: 280
                                }}>
                                    <Switch>
                                        <Route path="/" component={Dashboard} exact/>
                                        <Route path="/transactions" component={Transactions}/>
                                        <Route path="/profile" component={Profile}/>
                                        <Route component={PageNotFoundError}/>
                                    </Switch>
                                </Content>
                            </Layout>
                        </Layout>
                    </Layout>
                </BrowserRouter>
            </UserContext.Provider>:
            <div>
                {this.showConfirm()}
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
    return {
        onRoleChange: activeRoleId => {
            dispatch(setActiveRole(activeRoleId));
        }
    };

};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
