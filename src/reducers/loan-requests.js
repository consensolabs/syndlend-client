import { FETCH_LOAN_REQUESTS } from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
      case FETCH_LOAN_REQUESTS:
      return action.loanRequests;
    default:
      return state;
  }
}