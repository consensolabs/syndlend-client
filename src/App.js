import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { Layout, Menu, Dropdown, Icon } from "antd";

import Dashboard from './containers/dashboard.js';
import Menubar from './containers/menubar.js';

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

  render() {

    return (
      <BrowserRouter>
      <Layout>
        <Menubar />
        <Layout>
          <Sider width={200} style={{ background: "#fff" }}>
            <Menu mode="inline" defaultSelectedKeys={["0"]} className="main-menu">
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
            <Content style={{background: "#fff", padding: 24, margin: "16px 0px 0px 0px", minHeight: 280}}>
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
