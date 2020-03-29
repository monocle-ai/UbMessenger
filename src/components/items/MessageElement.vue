<template>
  <div>
    <div class="has-text-centered" v-bind:class="{'is-hidden':!message.UI_showDate}">
      <small>{{message.SendDateFormated}}</small>
    </div>

    <div class="message-container">
      <div v-bind:class="{'is-hidden':!isText, 'has-text-right':sendByUser}">
        <strong
          class="data_message_username"
          v-bind:class="{'is-hidden':!message.UI_showUsername}"
        >{{message.Username}}</strong>
      </div>
      <div class="box-container">
        <div
          class="box"
          v-bind:class="{'has-background-primary to-right':sendByUser, 'has-background-info to-left':!sendByUser}"
        >
          <figure class="image" v-bind:class="{'is-hidden':isText}">
            <img
              class="data_image"
              :src="imgSource"
              v-bind:class="{'is-hidden':isLoading}"
              style="height:150px; width:auto;"
            />

            <font-awesome-icon
              :icon="['fas','image']"
              v-bind:class="{'is-hidden':!isLoading}"
              style="height:150px"
            />
            <progress
              class="progress is-large is-info"
              v-bind:class="{'is-hidden':!isLoading}"
              max="100"
              style="margin-top: -50px; position:absolute;"
            >60%</progress>
          </figure>
          <div
            class="data_message_text"
            v-bind:class="{'is-hidden':!isText, 'has-text-right':sendByUser}"
          >{{message.Content}}</div>
        </div>

        <div v-for="reaction in message.messageReactions" :key="reaction.userID">{{reaction}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Client from "@/js/client.js";

export default {
  name: "MessageElement",
  data() {
    return {
      sendByUser: false,
      isLoading: true,
      isText: true,
      imgSource: ""
    };
  },
  props: ["message"],
  created: async function() {
    if (this.message.Username == localStorage.username) {
      this.sendByUser = true;
    }

    if (
      this.message.messenger &&
      this.message.senderID == localStorage.userid
    ) {
      this.sendByUser = true;
    }

    if (this.message.DataType == "Text") {
      this.isLoading = false;
    } else if (this.message.DataType == "Image") {
      this.isText = false;

      var imgSource = "";

      await Client.GetPicture(this.message.ConvID, this.message.Content).then(
        function(myBlob) {
          //console.log(myBlob);
          var objectURL = URL.createObjectURL(myBlob);
          imgSource = objectURL;
        }
      );

      this.imgSource = imgSource;
      this.isLoading = false;
    }
  }
};
</script>
<style scoped>
.message-container {
  padding: 0.1rem;
}
.box {
  padding: 0.5rem;
  width: auto;
}

.box-container {
  overflow: auto;
}

.to-right {
  float: right;
}

.to-left {
  float: left;
}
</style>