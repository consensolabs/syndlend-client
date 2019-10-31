const RippleAPI = require('ripple-lib').RippleAPI;


export class RippleService {

connect = () => {

    this.api = new RippleAPI({
        server: 'wss://s.altnet.rippletest.net' // Public rippled server hosted by Ripple, Inc.
    });


    this.api.on('error', (errorCode, errorMessage) => {
        console.log(errorCode + ': ' + errorMessage);
    });
    this.api.on('connected', () => {
        console.log('connected');
    });
    this.api.on('disconnected', (code) => {
        // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
        // will be 1000 if this was normal closure
        console.log('disconnected, code:', code);

    })


    return this.api.connect().then(() => {

    }).then(() => {
        // return api.disconnect();
    }).catch(console.error);

}


    fetchAccountInfo = () => {

        return this.api.getAccountInfo("rawuE2jrw7hJtmjasyse6Jy7Mma3iBCzco").then(info => {
            return info;

        }).catch(error => {return {};});


    }



}

module.export = RippleService;
