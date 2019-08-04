export class LoanService {

    createLoanRequest(braidConnect, agent, amount, company) {
        let promiseFunction = braidConnect.syndService.createLoanRequest(
            agent,
            amount,
            company
        )
            .then(response => {
                console.log("createLoanRequest-Response:", response)
                return response;
            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };



    syndicateLoan(braidConnect, proposalId) {
        let promiseFunction = braidConnect.syndService.syndicateLoan(
            proposalId
        )
            .then(response => {
                console.log("createLoanRequest-Response:", response)
                return response;
            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };

    createLendProposal(braidConnect, loanId, amount) {
        let promiseFunction = braidConnect.syndService.createLendRequest(
            loanId,
            amount
        )
            .then(response => {
                console.log("createLendRequest-Response:", response)
                return response;
            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };



    createLendResponse(braidConnect, proposalId) {
        let promiseFunction = braidConnect.syndService.createLendResponse(
            proposalId,
        )
            .then(response => {
                console.log("createLendRequest-Response:", response)
                return response;
            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };


    fetchRequestedLoans(braidConnect) {
        let promiseFunction = braidConnect.syndService.listLoanRequests()
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

    fetchIssuedLoans(braidConnect) {
        let promiseFunction = braidConnect.syndService.listIssuedLoans()
            .then(response => {
                const dataSource = response.map(item => ({
                    key: item.state.data.loanId.id,
                    loanReqID: item.state.data.loanReqID.id,
                    borrowerNode: item.state.data.borrowerNode.name,
                    loanId: item.state.data.loanId.id,
                    amount: item.state.data.amount,
                    status: item.state.data.status,

                }));
                console.log("fetchIssuedLoans-Response:", dataSource)
                return dataSource;
            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };

    fetchLendProposals(braidConnect) {
        let promiseFunction = braidConnect.syndService.listLendProposals()
            .then(response => {
                const dataSource = response.map(item => ({
                    key: item.state.data.proposalId.id,
                    proposalId: item.state.data.proposalId.id,
                    lenderNode: item.state.data.lenderNode.name,
                    loanId: item.state.data.loanId.id,
                    amount: item.state.data.amount,
                    accepted: item.state.data.accepted,

                }));
                console.log("fetchProposals-Response:", dataSource)
                return dataSource;
            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };

    updateLoanStatus(braidConnect, id, status) {
        let promiseFunction = braidConnect.syndService.issueLoan(
            'O=Agent Bank,L=Mumbai,C=IN',
            id
        )
            .then(response => {
                console.log("updateLoanStatus-Response:", response)
                return response;
            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };
}

module.export = LoanService;
