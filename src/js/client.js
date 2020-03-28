var host = "https://henri2h.fr:8443";

let client = {
  setConversationName(convID, convName) {
    fetch(host + "/Conversation/SetConversationName", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "token": localStorage.token,
        "username": localStorage.username
      },

      "body": JSON.stringify({
        "ConvName": convName,
        "ConvID": convID
      })
    })
      .then(function () {
        //console.log(response);
        localStorage.convName = convName;
      })
      .catch(err => {
        console.log(err);
      });
  },

  sendMessage(convID, text) {
    console.log("Going to send message");

    fetch(host + "/Conversation/SendConversationMessage", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "token": localStorage.token,
        "username": localStorage.username
      },
      "body": JSON.stringify({
        "ConvID": convID,
        "Content": text,
        "DataType": "Text"
      })
    })
      .then(response => {
        return response;
        // message send, we can reload
        //loadMessages(false, true);
      })
      .catch(err => {
        console.log(err);
      });
  }
  ,
  async loadConversationsList() {
    //console.log("Going to load conversation list");
    //console.log(localStorage.token);
    //console.log("Username : ",localStorage.username);

    return await fetch(host + "/v2/Conversation/ListConversations", {
      "method": "POST",
      "headers": {
        "content-type": "multipart/form-data; boundary=---011000010111000001101001",
        "token": localStorage.token,
        "username": localStorage.username
      }
    })
      .then(response => {
        //console.log(response);
        return response.json();
      })
      .then((result) => {
                localStorage.convsList = JSON.stringify(result);
        return result;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
  },
  async addConversation(convName, users) {
    var success = false;
    await fetch("https://henri2h.fr:8443/Conversation/AddConversation", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "token": localStorage.token,
        "username": localStorage.usernames
      },
      "body": JSON.stringify({
        "ConvName": convName,
        "Users": users
      })
    })
      .then(response => {
        return response.text();
      }).then(text => {
        if (text == "OK") success = true;
      })
      .catch(err => {
        console.log(err);
      });
    return success;
  },
  async loadMessages(convID) {
    if (convID == "" && localStorage.username == "") {
      console.log("Username or convID not set could not continue");
      return;
    }
    var shouldUpdate = "";

    return await fetch(host + "/Conversation/GetConversation", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "token": "token here",
        "username": localStorage.username
      },
      body: JSON.stringify({
        "ConvID": convID
      })
    })
      .then(response => {
        //console.log(response);
        return response.text();
      })
      .then((responseData) => {

        // should check if responseData is correct
        // check if we should update the conv
        var localElem = localStorage.getItem("conv_" + convID);

        if (localElem !== null) {
          var oldconv = JSON.parse(localElem);
          var newconv = JSON.parse(responseData);

          if (oldconv != null) {

            // detect if there is new messages
            // what if we delete a message then send a new 'fas fa-dice-one'

            if (oldconv["Messages"].length == newconv["Messages"].length) {
              shouldUpdate = false;
              return shouldUpdate; // directly return no need to update
            }

          }
        }

        shouldUpdate = true;
        localStorage.setItem("conv_" + convID, responseData);
        console.log("Should update");
        
        return shouldUpdate;
      })
      .catch(err => {
        console.log(err);
      });
  },

  connect(device_id) {
    fetch(host + "/V2.0/Account/connection", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "username": localStorage.username,
        "password": localStorage.password,
        "device_id": device_id
      },
      body: ""
    })
      .then(response => {
        return response.text();
      })
      .then(response => {
        console.log("Login : ", response);
        localStorage.token = response;
        window.AppCenter.Analytics.trackEvent('Logged in', { payload: response });
      });
  },


  async GetPicture(convID, fileName) {
    return await fetch(host + "/Conversation/GetPicture", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "token": localStorage.token,
        "username": localStorage.username
      },
      "body": JSON.stringify({
        "convID": convID,
        "fileName": fileName
      })
    })
      .then(response => {
        return response.blob();
      })
      .catch(err => {
        console.log("Err : " + err);
        return err;
      });
  },

  async SendPicture(convID, file) {
    return await fetch(host + "/Conversation/SendPicture", {
      "method": "POST",
      "headers": {
        "content-type": file.type,
        "token": localStorage.token,
        "username": localStorage.username,
        "convID": convID
      },
      body: file
    })
      .then(response => {
        console.log(response);
        return response;
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  }
}
export default client