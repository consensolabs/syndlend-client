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


### Create a new loan request [POST]:

```
/service/loan/request

```

### Verify a loan request [POST]:

```
/service/loan/verify

```

### Issue a new loan loan [POST]:

```
/service/loan/issue

```

### List all the issue loans [GET]:

```
/service/loan/issued

```

### Syndicate the loan [POST]:

```
/service/loan/syndicate

```
