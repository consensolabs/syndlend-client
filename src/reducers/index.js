import { combineReducers } from 'redux';
import loanRequests from './loan-requests';
import activeRoleId from './common';

export default combineReducers({
    loanRequests: loanRequests,
    activeRoleId: activeRoleId
});