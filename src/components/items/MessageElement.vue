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
          v-bind:class="{'sentByUser to-right':sendByUser, 'sentByOther to-left':!sendByUser}"
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
            v-bind:class="{'is-hidden':!isText, 'sentByUser':sendByUser}"
          >{{message.Content}}</div>
           <MessageReaction class="mReaction" v-bind:class="{'to-right':sendByUser, 'to-left':!sendByUser}" v-if="message.messageReactions.length > 0" :reactions="message.messageReactions" />
        </div>
       
      </div>
    </div>
  </div>
</template>

<script>
import Client from "@/js/client.js";
import MessageReaction from "./MessageReaction";

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
  components: { MessageReaction },
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
  border-radius: 20px;
  padding: 0.5rem 1rem;
  width: auto;
  max-width: 100%;
  word-wrap: break-word;
  max-width: 80%;
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

.sentByOther{
  background-color: #eee;
}
.sentByUser{
  background-color: rgb(0, 153, 255);
  color: white;
}

.mReaction{
  position:absolute
}
.mReaction.to-right{
  right: 2rem;
}
.mReaction.to-left{
  left: 0;
}

</style>