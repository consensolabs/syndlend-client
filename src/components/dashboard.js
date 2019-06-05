import React from 'react';

import BorrowerDashboard from './roles/borrower.js';

class Dashboard extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
       <BorrowerDashboard />
    );
  }
}

export default Dashboard;