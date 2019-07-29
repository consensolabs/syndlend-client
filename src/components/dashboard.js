import React from "react";
import { connect } from 'react-redux';
import RequestedLoans from './requested-loans';
import IssuedLoans from './issued-loans';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
  }

  // 0-Borrower, 1-Agent, 2-Lender

  render() {
    switch (this.props.activeRoleId) {
      case '0': return (
        <React.Fragment>
          <h2> Dashboard </h2>
          <RequestedLoans />
        </React.Fragment>
      );
      case '1': return (
        <React.Fragment>
          <h2> Dashboard </h2>
          <RequestedLoans />
          <IssuedLoans />
        </React.Fragment>
      );
      case '2': return (
        <React.Fragment>
          <h2> Dashboard </h2>
          <IssuedLoans />
        </React.Fragment>
      );
      default: return (
        <h2>I am no where</h2>
      );
    }
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