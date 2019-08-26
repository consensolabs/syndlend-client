import React from "react";
import { connect } from 'react-redux';
import RequestedLoans from './requested-loans';
import IssuedLoans from './issued-loans';
import DisbursalDetails from './disbursal-details';


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
          <RequestedLoans roleId={this.props.activeRoleId}/>
          <DisbursalDetails />
        </React.Fragment>
      );
      case '1': return (
        <React.Fragment>
          <h2> Dashboard </h2>
          <RequestedLoans roleId={this.props.activeRoleId}/>
          <IssuedLoans roleId={this.props.activeRoleId} />
        </React.Fragment>
      );
      case '2': return (
        <React.Fragment>
          <h2> Dashboard </h2>
          <IssuedLoans roleId={this.props.activeRoleId} type={"all"}/>
          <IssuedLoans roleId={this.props.activeRoleId} type={"own"} />
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
