import { GET_ACTIVE_ROLE, SET_ACTIVE_ROLE, RPC_CONNECT, RPC_STATUS } from './types';
import { Proxy } from 'braid-client';

const onRPCOpen = () => {
    console.log("Connected");
    return {
        type: RPC_STATUS,
        braidStatus: true
    }
}

const onRPCClose = () => { console.log('Disconnected from node'); }

const onRPCError = (err) => { console.error(err); }

export const braidConnect = () => {
    let braidConnect = new Proxy({url: 'http://localhost:8888/api/'}, onRPCOpen, onRPCClose, onRPCError, {strictSSL: false})
    return {
        type: RPC_CONNECT,
        braidConnect
    }
}

export const getActiveRole = () => {
    let activeRoleId = '0'
    return {
        type: GET_ACTIVE_ROLE,
        activeRoleId
    }
}

export const setActiveRole = (activeRoleId) => {
    return {
        type: SET_ACTIVE_ROLE,
        activeRoleId
    }
}