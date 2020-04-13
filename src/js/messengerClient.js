let client = {
    async listConversations(count, timestamp, tags) {
        return await fetch(localStorage.url + "listConversations", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                "token": localStorage.token,
                "count":count,
                "timestamp":timestamp,
                "tags":tags
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
    async searchForThread(name,  num_users, num_groups, num_pages) {
        return await fetch(localStorage.url + "searchForThread", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                "token": localStorage.token,
                "name":name,
                "num_pages":num_pages,
                "num_users":num_users,
                "num_groups":num_groups
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
    async getThreadHistory(threadID, count, timestamp) {
        return await fetch(localStorage.url + "getThreadHistory", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                "token": localStorage.token,
                "threadID": threadID,
                messageCount:count,
                timestamp:timestamp
            })
        })
            .then(response => {
                return response.json()
            })
            .then(response => {
                //console.log(response);
                return { "data": response, "success": true };
            })
            .catch(err => {
                return { "success": false, "error":err };
            });
    },
    async getThreadInfo(threadID) {
        return await fetch(localStorage.url + "getThreadInfo", {
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
                return { "convInfo": response, "success": true };
            })
            .catch(err => {
                return { "success": false, "error":err };
            });
    },
    async getCurrentUserID() {
        return await fetch(localStorage.url + "getCurrentUserID", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                "token": localStorage.token,
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

            if (udata.success && udata.user[userID] != null) {
                list[userID] = udata.user[userID].name;

                localStorage.usernamesList = JSON.stringify(list);
                return list[userID];
            }
            else{
                console.error("Invalid result");
            }
        }
        else {
            return list[userID];
        }
    }
};

export default client;