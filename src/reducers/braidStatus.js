import { RPC_STATUS } from '../actions/types';

export default function (state = false, action) {
  console.log(action)
  switch (action.type) {
    case RPC_STATUS:
      return action.braidStatus;
    default:
      return state;
  }
}