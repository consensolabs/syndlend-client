import { Proxy } from 'braid-client';


export class LoanService {

    connected = false;

    onRPCOpen = () => {
        console.log('Connected to node');
        this.connected = true;
    };


    onRPCClose = () => {
        console.log('Disconnected from node');
    };


    onRPCError = (err) => {
        console.error(err);
    };


    braidConnect = new Proxy({url: 'http://localhost:8888/api/'}, this.onRPCOpen, this.onRPCClose, this.onRPCError, {strictSSL: false});



    createLoanRequest(reqData) {
        let promiseFunction = this.braidConnect.syndService.createLoanRequest(
            reqData.agent,
            reqData.amount,
            reqData.company
        )
            .then(response => {
                console.log("createLoanRequest-Response:", response)
                return response;
            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    }



    fetchRequestedLoans() {
        let promiseFunction = this.braidConnect.syndService.listLoanRequests()
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
        return promiseFunction;
    };
}

module.export = LoanService;
