import { GET_ACTIVE_ROLE, SET_ACTIVE_ROLE } from './types';
import React from "react";


export const getActiveRole = () => {
    let activeRoleId = '0'
    return {
        type: GET_ACTIVE_ROLE,
        activeRoleId
    }
};

export const setActiveRole = (activeRoleId) => {
    return {
        type: SET_ACTIVE_ROLE,
        activeRoleId
    }
};
