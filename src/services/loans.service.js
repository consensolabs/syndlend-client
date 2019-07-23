import { Proxy } from 'braid-client';

export const loansService = {
    createLoanRequest,
    fetchRequestedLoans
};

const onRPCOpen = () => {
    console.log('Connected to node');
}

const onRPCClose = () => { 
    console.log('Disconnected from node');
}

const onRPCError = (err) => {
    console.error(err);
}

const braidConnect = new Proxy({url: 'http://localhost:8888/api/'}, onRPCOpen, onRPCClose, onRPCError, {strictSSL: false})

function createLoanRequest(reqData) {
    braidConnect.syndService.createLoanRequest(
        reqData.agent,
        reqData.amount,
        reqData.company
    )
        .then(response => {
            console.log("createLoanRequest-Response:",response)
            return response;
        })
        .catch(error => {
            throw (error);
        });
}

function fetchRequestedLoans() {
    braidConnect.syndService.listLoanRequests()
        .then(response => {
            const dataSource = response.map(item => ({
                key: item.state.data.loanReqID.id,
                loanReqID: item.state.data.loanReqID.id,
                companyName: item.state.data.companyName,
                timestamp: item.state.data.timestamp,
                amount: item.state.data.amount,
                status: item.state.data.status
            }))
            console.log("fetchLoanRequests-Response:", dataSource)
            return dataSource;
        })
        .catch(error => {
            throw (error);
        });
};
