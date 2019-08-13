export class UserService {

    KYC_SERVER_URL = "http://localhost:5000/v1/users/info";
    TOKEN = "gAAAAABdRBLdFUSDZIi0L4YBSorN86YcCbPeYQoS0EqD0vNxmM8R7I5L_m0-KsD4APc4MRsrzZkRoOh9chp7u1NkCSTC3r-04w==";


    fetchUsersInfo(user_id=null, shared_id=null) {

        let promiseFunction = fetch(
            this.KYC_SERVER_URL + (user_id ? ('?user_id=' + user_id) : (shared_id ? ('?shared_id=' + shared_id) : '')),
            {
                method: 'GET',
                headers: {

                    'Authorization': this.TOKEN,
                }

            }).then(res => res.json())
            .then(function (response) {

            return response;
        }).catch(function (error) {
            console.log(error);
            return {ok: false, msg: error};
        });

        return promiseFunction;


    }

    updateUserInfo(data) {
        console.log(data);

        let promiseFunction = fetch(
            this.KYC_SERVER_URL,
            {
                method: 'POST',
                headers: {

                    'Authorization': this.TOKEN,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(data),


            }).then(res => res.json())
            .then(function (response) {

                return response;
            }).catch(function (error) {
                console.log(error);
                return {ok: false, msg: error};
            });

        return promiseFunction;


    }




}

module.export = UserService;
