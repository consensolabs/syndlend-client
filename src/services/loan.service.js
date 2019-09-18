export class LoanService {


    myInfo(braidConnect) {
        let promiseFunction = braidConnect.syndService.myInfo()
            .then(response => {
                console.log("myInfo-Response:", response);
                return response;

            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };

    fetchPeers(braidConnect) {
        let promiseFunction = braidConnect.syndService.getParties()
            .then(response => {
                console.log("fetchPeers-Response:", response);
                return response.peers;

            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };

    fetchTransactions(braidConnect) {
        let promiseFunction = braidConnect.syndService.listTransactions()
            .then(response => {
                console.log("fetchTransactions-Response:", response)
                return response;

            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };




    fetchCashBalance(braidConnect, currency) {
        let promiseFunction = braidConnect.syndService.getCashBalance(currency)
            .then(response => {
                console.log("fetchLoanRequests-Response:", response)
                return response;

            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };

    selfIssueCash(braidConnect, value, currency) {
        let promiseFunction = braidConnect.syndService.selfIssueCash(value, currency)
            .then(response => {
                console.log("selfIssueCash-Response:", response)
                return response;

            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };

    disburseLoan(braidConnect, loanId) {

        let promiseFunction = braidConnect.syndService.disburseLoan(loanId)
            .then(response => {
                console.log("disburseLoan-Response:", response)
                return response;
            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;

    }



    createLoanRequest(braidConnect, agent, amount, interest, lockDate) {
        let promiseFunction = braidConnect.syndService.createLoanRequest(
            agent,
            amount,
            interest,
            lockDate
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
                console.log(response);
                const dataSource = response.map(item => ({
                    key: item.state.data.loanReqID.id,
                    loanReqID: item.state.data.loanReqID.id,
                    borrowerName: item.state.data.financeNode.name,
                    borrowerKey: item.state.data.financeNode.owningKey,
                    timestamp: item.state.data.timestamp,
                    amount: item.state.data.amount,
                    interestRate: item.state.data.interestRate,
                    lockDate: item.state.data.lockDate,
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
                    owner: item.state.data.owner.name,
                    loanId: item.state.data.loanId.id,
                    obligationId: item.state.data.obligationId ? item.state.data.obligationId.id : null,
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


    updatePaymentMethod(braidConnect, id, address, oracle) {
        let promiseFunction = braidConnect.settlerService.updateSettlementMethod(
            id,
            address,
            oracle
        )
            .then(response => {
                console.log("updatePaymentMethod-Response:", response)
                return response;
            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };

    novateObligation(braidConnect, id, oracle) {
        let promiseFunction = braidConnect.settlerService.novateObligation(
            id,
            oracle
        )
            .then(response => {
                console.log("novateObligation-Response:", response)
                return response;
            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };

    createObligation(braidConnect, amount, role, counterParty, dueTimeDelta) {
        let promiseFunction = braidConnect.settlerService.createObligation(
            amount,
            role,
            counterParty,
            dueTimeDelta
        )
            .then(response => {
                console.log("createObligation-Response:", response)
                return response;
            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };

    settleObligation(braidConnect, amount, obligationId) {
        let promiseFunction = braidConnect.settlerService.settleObligation(
            amount,
            obligationId
        )
            .then(response => {
                console.log("createObligation-Response:", response)
                return response;
            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };

    disburseLoanWithObligation(braidConnect, loanId, obligationId) {
        let promiseFunction = braidConnect.syndService.disburseLoanWithObligation(
            loanId,
            obligationId
        )
            .then(response => {
                console.log("disburseLoanWithObligation-Response:", response)
                return response;
            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };

    fetchObligations(braidConnect) {
        let promiseFunction = braidConnect.settlerService.listObligations()
            .then(response => {
                const dataSource = response.map(item => ({
                    key: item.state.data.linearId.id,
                    obligationId: item.state.data.linearId.id,
                    lenderNode: item.state.data.obligor.name,
                    amount: parseInt(item.state.data.faceAmount.quantity) * parseFloat(item.state.data.faceAmount.displayTokenSize),
                    status: item.state.data.settlementStatus,
                    settlementMethod: item.state.data.settlementMethod,
                    payments: item.state.data.payments

                }));
                console.log("fetchObligations-Response:", dataSource)
                return dataSource;
            })
            .catch(error => {
                throw (error);
            });
        return promiseFunction;
    };


    updateLoanStatus(braidConnect, id, status) {
        let promiseFunction = braidConnect.syndService.issueLoan(
            'O=Loan Lender, L=Paris, C=FR',
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
