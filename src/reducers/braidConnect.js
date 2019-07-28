import { RPC_CONNECT } from '../actions/types';

export default function (state = {}, action) {
  console.log(action)
  switch (action.type) {
    case RPC_CONNECT:
      return action.braidConnect;
    default:
      return state;
  }
}