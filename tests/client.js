"use strict";

const express = require('express')
const Proxy = require('braid-client').Proxy;

const app = express();
var bodyParser = require('body-parser');
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Connects to Braid running on the node.
let braid = new Proxy({
  url: "http://projects.koshikraj.com:8888/api/"
}, onOpen, onClose, onError, { strictSSL: false });

function onOpen() { console.log('Connected to node.'); }
function onClose() { console.log('Disconnected from node.'); }
function onError(err) { console.error(err); process.exit(); }


// Uses RPC call the Braid RPC Service on the node, and handles the response
// using callbacks.

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
});

app.post('/service/loan/issue', urlencodedParser,  (req, res) => {

    braid.syndService.issueLoan(
    req.body.borrower,
    req.body.owner,
    req.body.amount,
    req.body.loanreq_id,
    result => res.send("Transaction ID: " + result + "!"),
    err => res.status(500).send(err));
});


app.post('/service/loan/syndicate', urlencodedParser,  (req, res) => {

    braid.syndService.syndicateLoan(
    req.body.new_owner,
    req.body.amount,
    req.body.loan_id,
    result => res.send("Transaction ID: " + result + "!"),
    err => res.status(500).send(err));
});

app.get('/service/loan/issued', (req, res) => {

    braid.syndService.listIssuedLoans(

    result => res.send("State details: " + JSON.stringify(result) + "!"),
    err => res.status(500).send(err));
});

app.listen(3000, () => console.log('Server listening on port 3000!'))
