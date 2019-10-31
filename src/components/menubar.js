import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, Menu, Dropdown, Icon, Row, Col } from "antd";
import { setActiveRole } from '../actions';

const { Header } = Layout;

const Menubar = ({ activeRoleId, onRoleChange }) => {

    const handleMenuClick = (e) => {
        if (parseInt(e.key) < 3) {
            onRoleChange(e.key);
        }
        else {
            userLogOut()
        }
    };

    const userLogOut = () => {
        localStorage.removeItem('nodeInfo');
        window.location.reload();
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
        {/*<Menu.Item key="0">*/}
            {/*<span> Borrower </span>*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Divider />*/}
        {/*<Menu.Item key="1">*/}
            {/*<span> Agent </span>*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Divider />*/}
        {/*<Menu.Item key="2">*/}
            {/*<span> Lender </span>*/}
        {/*</Menu.Item>*/}
        <Menu.Item key="2">
            <span> Settings </span>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">
            <span> Logout </span>
        </Menu.Item>
        </Menu>
    );

    const roleMap = {
        '0': 'Borrower',
        '1': 'Agent',
        '2': 'Lender',
    }
    return (
        <Header className="header" style={{backgroundColor: "#17293c"}}>
        <Row>
        <NavLink to="/">

        <Col span={1}>
        <div className="syndlend-doodle" />
        </Col>

        <Col span={2}>
        <span style={{color: '#bea6c6', fontSize: 20}}> SyndLend </span>
        </Col>
        </NavLink>
        <Col span={21}>
        <Dropdown.Button
          className="user-btn"
          overlay={menu}
          icon={<Icon type="user" />}
        >
          {roleMap[activeRoleId]}
        </Dropdown.Button>
        <Menu theme="dark" mode="horizontal" style={{ lineHeight: "64px", backgroundColor: "#17293c"}} />
        </Col>
        </Row>
      </Header>
    )
}

const mapStateToProps = state => {
  return {
    activeRoleId: state.activeRoleId
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
)(Menubar);
