import { GET_ACTIVE_ROLE, SET_ACTIVE_ROLE } from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case GET_ACTIVE_ROLE:
      return action.activeRoleId;
    case SET_ACTIVE_ROLE:
      return action.activeRoleId;
    default:
      return state;
  }
}