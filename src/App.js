import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { Layout, Menu, Dropdown, Icon } from "antd";

import Dashboard from './components/dashboard.js';
import Profile from './components/profile.js';
import Transactions from './components/transactions.js';
import Error from './components/error.js';

import "antd/dist/antd.css";
import "./App.css";


const { Header, Content, Sider } = Layout;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      roleKey: '0',
    };
  }

  handleMenuClick = (e) => {
    this.setState({roleKey: e.key})
    console.log("click", e);
  };

  menu = (
    <Menu onClick={this.handleMenuClick}>
      <Menu.Item key="0">
        <span> Borrower </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <span> Agent </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2">
        <span> Lender </span>
      </Menu.Item>
    </Menu>
  );

  roleMap = {
    '0': 'Borrower',
    '1': 'Agent',
    '2': 'Lender',
  }

  render() {

    return (
      <BrowserRouter>
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Dropdown.Button
            className="user-btn"
            overlay={this.menu}
            icon={<Icon type="user" />}
          >
            {this.roleMap[this.state.roleKey]}
          </Dropdown.Button>
          <Menu theme="dark" mode="horizontal" style={{ lineHeight: "64px" }} />
        </Header>
        <Layout>
          <Sider width={200} style={{ background: "#fff" }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={["0"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <Menu.Item key="0">
              <NavLink to="/">
                <span>
                  <Icon type="dashboard" />
                  Dashboard
                </span></NavLink>
              </Menu.Item>
              <Menu.Item key="1">
              <NavLink to="/transactions"><span>
                  <Icon type="swap" />
                  Transactions
                </span></NavLink>
              </Menu.Item>
              <Menu.Item key="2">
              <NavLink to="/profile"><span>
                  <Icon type="user" />
                  Profile
                </span></NavLink>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Content
              style={{
                background: "#fff",
                padding: 24,
                margin: "16px 0px 0px 0px",
                minHeight: 280
              }}
            >
                <Switch>
                  <Route path="/" component={Dashboard} exact />
                  <Route path="/transactions" component={Transactions} />
                  <Route path="/profile" component={Profile} />
                  <Route component={Error} />
                </Switch>
            </Content>
          </Layout>
        </Layout>
      </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
