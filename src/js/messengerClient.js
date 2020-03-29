let client = {
    async listConversations() {
        return await fetch(localStorage.url + "listConversations", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                "token": localStorage.token
            })
        })
            .then(response => {
                return response.json()
            })
            .then(response => {
                //console.log(response);
                if(response.success == false){
                    return response;
                }
                return { "convs": response, "success": true };
            })
            .catch(err => {
                return { "success": false, error:err };
            });
    },
    async getThreadHistory(threadID) {
        return await fetch(localStorage.url + "getThreadHistory", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                "token": localStorage.token,
                "threadID": threadID
            })
        })
            .then(response => {
                return response.json()
            })
            .then(response => {
                //console.log(response);
                return { "convs": response, "success": true };
            })
            .catch(err => {
                return { "success": false, "error":err };
            });
    },
    async getUserInfo(userID) {
        return await fetch(localStorage.url + "getUserInfo", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                "token": localStorage.token,
                "id": userID
            })
        })
            .then(response => {
                return response.json()
            })
            .then(response => {
                //console.log(response);
                return { "user": response, "success": true };
            })
            .catch(err => {
                console.log(err);
                return { "success": false };
            });
    },

    async sendMessage(threadID, text) {
        return await fetch(localStorage.url + "sendMessage", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                "token": localStorage.token,
                "threadID": threadID,
                "text": text
            })
        })
            .then(response => {
                return response.json()
            })
            .then(response => {
                //console.log(response);
                return { "result": response, "success": true };
            })
            .catch(err => {
                console.log(err);
                return { "success": false };
            });
    },
    async getUserName(userID) {
        if (localStorage.usernamesList == undefined) {
        localStorage.usernamesList = JSON.stringify({});
            console.log("reste");
        }
        var list = JSON.parse(localStorage.usernamesList);
        
        if (list[userID] === undefined) {
            var udata = await this.getUserInfo(userID);

            if (udata.success) {
                list[userID] = udata.user[userID].name;

                localStorage.usernamesList = JSON.stringify(list);
                return list[userID];
            }
        }
        else {
            return list[userID];
        }
    }
};

export default client;