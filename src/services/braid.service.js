import { Proxy } from 'braid-client';


export class BraidService {

    connected = false;
    connection = null;

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


    connect = (url) => {
        this.connected = false;
        this.connection = null;

        this.connection = new Proxy({url: url}, this.onRPCOpen, this.onRPCClose, this.onRPCError, {strictSSL: false});
    }

}

module.export = BraidService;
