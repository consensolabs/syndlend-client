"use strict";

const express = require('express')
const Proxy = require('braid-client').Proxy;


const app = express();
var bodyParser = require('body-parser');
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Connects to Braid running on the node.
let braid = new Proxy({
    url: "http://localhost:8888/api/"
}, onOpen, onClose, onError, { strictSSL: false });

function onOpen() { console.log('Connected to node.'); }
function onClose() { console.log('Disconnected from node.'); }
function onError(err) { console.error(err); process.exit(); }


// Uses RPC call the Braid RPC Service on the node, and handles the response
// using callbacks.
app.get('/service/me', (req, res) => {

    braid.syndService.myInfo(
        result => res.send("Participants: " + JSON.stringify(result) + "!"),
        err => res.status(500).send(err));
});


app.get('/service/participants', (req, res) => {

    braid.syndService.getParties(
        result => res.send("Participants: " + JSON.stringify(result) + "!"),
        err => res.status(500).send(err));
});

app.get('/service/loan/requests', (req, res) => {

    braid.syndService.listLoanRequests(
        result => res.send("State details: " + JSON.stringify(result) + "!"),
        err => res.status(500).send(err));
});

app.get('/service/loan/:loanid/request', (req, res) => {

    braid.syndService.listLoanRequestDetails(

        req.params.loanid,
        result => res.send("State details: " + JSON.stringify(result) + "!"),
        err => res.status(500).send(err));
});

app.post('/service/loan/request', urlencodedParser,  (req, res) => {

    braid.syndService.createLoanRequest(
        req.body.agent,
        req.body.amount,
        req.body.company,
        result => res.send("Transaction ID: " + result + "!"),
        err => res.status(500).send(err));
})

app.post('/service/loan/verify', urlencodedParser,  (req, res) => {

    braid.syndService.verifyLoanRequest(
        req.body.verifier,
        req.body.loanid,
        result => res.send("Transaction ID: " + result + "!"),
        err => res.status(500).send(err));
});

app.post('/service/loan/issue', urlencodedParser,  (req, res) => {

    braid.syndService.issueLoan(
        req.body.lender,
        req.body.loanreq_id,
        result => res.send("Transaction ID: " + result + "!"),
        err => res.status(500).send(err));
});



app.post('/service/propose/request', urlencodedParser,  (req, res) => {

    braid.syndService.createLendRequest(
        req.body.loan_id,
        req.body.amount,
        result => res.send("Transaction ID: " + result + "!"),
        err => res.status(500).send(err));
});

app.post('/service/propose/response', urlencodedParser,  (req, res) => {

    braid.syndService.createLendResponse (
        req.body.proposal_id,
        result => res.send("Transaction ID: " + result + "!"),
        err => res.status(500).send(err));
});


app.get('/service/propose/request', urlencodedParser,  (req, res) => {

    braid.syndService.listLendProposals(
        result => res.send("Proposals: " + JSON.stringify(result)),
        err => res.status(500).send(err));
});


app.post('/service/loan/syndicate', urlencodedParser,  (req, res) => {

    braid.syndService.syndicateLoan(
        req.body.proposal_id,
        result => res.send("Transaction ID: " + result + "!"),
        err => res.status(500).send(err));
});

app.get('/service/loan/issued', (req, res) => {

    braid.syndService.listIssuedLoans(

        result => res.send("State details: " + JSON.stringify(result) + "!"),
        err => res.status(500).send(err));
});


app.get('/service/cash/balance/:currency', (req, res) => {

    braid.syndService.getCashBalance(
        req.params.currency,

        result => res.send(result),
        err => res.status(500).send(err));
});



app.post('/service/cash/issue', urlencodedParser,  (req, res) => {

    braid.syndService.selfIssueCash(
        req.body.amount,
        req.body.currency,
        result => res.send("Transaction ID: " + result + "!"),
        err => res.status(500).send(err));
});

app.post('/service/loan/disburse', urlencodedParser,  (req, res) => {

    braid.syndService.disburseLoan(
        req.body.loanid,
        result => res.send("Transaction ID: " + result + "!"),
        err => res.status(500).send(err));
});




app.listen(3001, () => console.log('Server listening on port 3001!'))
