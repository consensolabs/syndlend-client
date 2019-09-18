export class UserService {

    KYC_SERVER_URL = "http://localhost:5000/v1/";
    TOKEN = "gAAAAABdRBLdFUSDZIi0L4YBSorN86YcCbPeYQoS0EqD0vNxmM8R7I5L_m0-KsD4APc4MRsrzZkRoOh9chp7u1NkCSTC3r-04w==";


    fetchUsersInfo(user_id=null, shared_id=null) {

        let promiseFunction = fetch(
            this.KYC_SERVER_URL + 'users/info' + (user_id ? ('?user_id=' + user_id) : (shared_id ? ('?shared_id=' + shared_id) : '')),
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
            return { meta:{ status: false, message: error } };
        });

        return promiseFunction;


    }

    fetchProjectsInfo(user_id=null, shared_id=null) {

        let promiseFunction = fetch(
            this.KYC_SERVER_URL + 'projects' + (user_id ? ('?user_id=' + user_id) : (shared_id ? ('?shared_id=' + shared_id) : '')),
            {
                method: 'GET',
                headers: {

                    'Authorization': this.TOKEN,
                }

            }).then(res => res.json())
            .then(function (response) {
                let projectsList = response;

                if (response.data) {
                projectsList["data"] = response.data.map(item => ({
                    key: item.id,
                    id: item.id,
                    name: item.name,
                    p_net_income: item.p_net_income,
                    modified: item.modified,
                    created: item.created,
                    p_revenue: item.p_revenue,
                    user_id: item.user_id,
                    p_total_assets: item.p_total_assets,

                }));
                }
                return projectsList;

            }).catch(function (error) {
                console.log(error);
                return { meta:{ status: false, message: error } };
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

    updateProjectInfo(data) {
        console.log(data);

        let promiseFunction = fetch(
            this.KYC_SERVER_URL + 'projects',
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
