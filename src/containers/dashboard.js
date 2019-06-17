import React from 'react';
import { connect } from 'react-redux';
import BorrowerDashboard from '../components/borrower';

const Dashboard = ({ activeRoleId }) => {

  switch (activeRoleId) {
    case '0': return (
      <BorrowerDashboard />
    );
    case '1': return (
      <h2> Agent </h2>
    );
    case '2': return (
      <h2> Lender </h2>
    );
    default: return (
      <BorrowerDashboard />
    );
  }
}

const mapStateToProps = state => {
  return {
    activeRoleId: state.activeRoleId
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);