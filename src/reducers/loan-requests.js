import { CREATE_LOAN_REQUEST, FETCH_LOAN_REQUESTS } from '../actions/types';

export default function loanReqsReducer(state = [], action) {
  switch (action.type) {
    case CREATE_LOAN_REQUEST:
      return [...state, action.payload];
      case FETCH_LOAN_REQUESTS:
      return action.loanRequests;
    default:
      return state;
  }
}