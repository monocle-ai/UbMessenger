var serverName = "https://code.henri2h.fr:8073/";
var token = "";

let client = {
    async listConversations() {
        return await fetch(serverName + "listConversations", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                "token": token
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
                console.log(err);
                return { "success": false };
            });
    },
    async getThreadHistory(threadID) {
        return await fetch(serverName + "getThreadHistory", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                "token": token,
                "threadID":threadID
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
                console.log(err);
                return { "success": false };
            });
    },
    async getUserInfo(userID) {
        return await fetch(serverName + "getUserInfo", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                "token": token,
                "id":userID
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
        return await fetch(serverName + "sendMessage", {
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                "token": token,
                "threadID":threadID,
                "text":text
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
    }    
};

export default client;