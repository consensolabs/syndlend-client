# Test HTTP interface to communicate with the RPC methods (Corda Braid service)

Endpoints are only for testing. Make RPC calls directly to the node in the client applications.

## Quick start
Make sure you have the latest version of node and npm installed

```
npm install
node client.js
```


### Get all the nodes in the network [GET]:

```
/service/participants

```

### Get all the loan requests [GET]:

```
/service/loan/requests

```

### Get details of a loan request [GET]:

Replace `loanid` with the actual loan ID

```
/service/loan/:loanid/request

```

#### Invoker: Borrower Party
### Create a new loan request [POST]:

```
/service/loan/request

```

#### Invoker: Verifier Party (Manual trigger for now)
### Verify a loan request [POST]:

```
/service/loan/verify

```

#### Invoker: Agent Party
### Issue a new loan loan [POST]:

```
/service/loan/issue

```
#### Invoker: Agent/ Lender Party
### List all the issue loans [GET]:

```
/service/loan/issued

```

#### Invoker: Lender Party
### Propose a lend request [POST]:

```
service/propose/request

```

#### Invoker: Agent/ Borrower Party
### List proposal [GET]:

```
/service/propose/request
```

#### Invoker: Agent Party
### Propose a lend response[POST]:

```
service/propose/response

```

#### Invoker: Agent Party
### Syndicate the loan [POST]:

```
/service/loan/syndicate

```
