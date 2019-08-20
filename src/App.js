import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Menu, Dropdown, Layout, Modal, Icon, Spin, Alert, Row, Col } from "antd";
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

const { Content } = Layout;

class App extends React.Component {

  contextData = {};

  constructor(props) {
    super(props);




    this.state = {
        login: false,
        confirmLoading: false,
        me: {},
        loading: true,
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
                  this.setState({ me: me,
                      loading: false});
                  this.contextData["me"] = me;

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

    async onNodeChange (url) {

        this.setState({loading: true});

        braidService.connect(url);
        while (!braidService.connected) {
            console.log("waiting for connection: sleeping for 100 ms")
            await this.sleep(100);
        }

        this.contextData["connection"] = braidService.connection;

        this.fetchMyInfo();

    }



    getNodes= () =>{
        let nodeList = [{name:"Borrower node",url: "http://localhost:8001/api/", roleId: "0"},
            {name:"Agent node",url: "http://localhost:8002/api/", roleId: "1"},
            {name:"Lender node",url: "http://localhost:8003/api/", roleId: "2"}];
        return(
            <Menu onClick={({item})=>{console.log(item);this.onNodeChange(item.props.url);this.props.onRoleChange(item.props.roleId);}}>
                {
                    nodeList.map((node) =><Menu.Item key={node.name} url={node.url} roleId={node.roleId}>{node.name}</Menu.Item>)
                }
            </Menu>);
    };

    showConfirm() {
      return(
        <Modal
            title={<div><Row className="logo" /><Row span={12} style={{marginLeft: 18}}>User Login</Row></div>}
            visible={!this.state.login}
            onOk={this.handleOk}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel} >

            <div>

            <Dropdown overlay={this.getNodes()}>
                <a className="ant-dropdown-link" href="#">
                    Select a node to connect <Icon type="down" />
                </a>
            </Dropdown>,



                <Spin spinning={this.state.loading}>
                <Alert
                    message="You are logged in as:"
                    description={<span><Icon style={{ fontSize: '24px', color: '#08c' }}  type="bank"/> {this.state.me.name} </span>}
                    type="info"
                    showIcon
                />
                </Spin>

                Do you want to continue?

            </div>



        </Modal>
      );
    }

  render() {

    return (
        this.state.login ?
            <UserContext.Provider value={this.contextData}>
                <BrowserRouter>
                    <Layout>
                        <Menubar/>
                        <Layout>
                            <SideMenuBar/>
                            <Layout style={{padding: "0 24px 24px"}}>
                                <Content style={{
                                    background: "#fff",
                                    padding: 24,
                                    margin: "16px 0px 0px 0px",
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
