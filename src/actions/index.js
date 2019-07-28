import { GET_ACTIVE_ROLE, SET_ACTIVE_ROLE, FETCH_LOAN_REQUESTS, RPC_CONNECT, RPC_STATUS } from './types';
import { Proxy } from 'braid-client';

const onRPCOpen = () => {
    console.log("CONNECTED")
    return {
        type: RPC_STATUS,
        braidStatus: true
    }
}

const onRPCClose = () => { console.log('Disconnected from node'); }

const onRPCError = (err) => { console.error(err); }

export const braidConnect = () => {
    let braidConnect = new Proxy({url: 'http://localhost:8888/api/'}, onRPCOpen, onRPCClose, onRPCError, {strictSSL: false})
    console.log("braidConnect:",braidConnect)
    return {
        type: RPC_CONNECT,
        braidConnect
    }
}

export const fetchLoanRequests = (loanRequests) => {
    return {
      type: FETCH_LOAN_REQUESTS,
      loanRequests
    }
};

export const fetchAllLoanRequests = (braidConnect) => {
    return (dispatch) => {
        return braidConnect.syndService.listLoanRequests()
            .then(response => {
                const dataSource = response.map(item => ({
                    key: item.state.data.loanReqID.id,
                    loanReqID: item.state.data.loanReqID.id,
                    companyName: item.state.data.companyName,
                    timestamp: item.state.data.timestamp,
                    amount: item.state.data.amount,
                    status: item.state.data.status
                }))
                dispatch(fetchLoanRequests(dataSource))
            })
            .catch(error => {
                throw(error);
            });
    };
};

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