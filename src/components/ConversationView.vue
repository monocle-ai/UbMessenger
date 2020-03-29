<template>
  <div>
    <NavBar
      :PageName="ConvName"
      MainActionPath="ConvList"
      SecondActionName="ConvSetting"
      SecondActionPath="ConvSettings"
    />

    <section class="section">
      <infinite-loading @infinite="infiniteHandler" direction="top"></infinite-loading>
      <div v-for="element in convElems" :key="element.MessageID">
        <MessageView :message="element" />
      </div>
    </section>

    <br />
    <br />

    <br />

    <nav class="navbar is-fixed-bottom" role="navigation" aria-label="main navigation">
      <div class="navbar-menu is-active">
        <div class="navbar-item is-expanded field has-addons">
          <div class="control">
            <input
              type="file"
              ref="img_files"
              accept="image/*, .pdf"
              multiple
              v-on:change="loadPicture"
              style="display:none;"
            />
            <button class="button is-info has-text-white" v-on:click="addFiles()">
              <font-awesome-icon :icon="['fas','image']" />
            </button>
          </div>
          <form class="control is-expanded" @submit.prevent="sendMessage()">
            <p class="control has-icons-left has-icons-right">
              <input class="input" type="text" v-model="messageComposerText" placeholder="Message" />
              <span class="icon is-small is-left">
                <font-awesome-icon :icon="['fas','comment-alt']" />
              </span>
              <span class="icon is-small is-right">
                <font-awesome-icon :icon="['fas','check']" />
              </span>
            </p>
          </form>
          <div class="control">
            <button class="button is-info" v-on:click="sendMessage()">Send</button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import Client from "@/js/client.js";
import MClient from "@/js/messengerClient";

import Compressor from "compressorjs";

// UI :
import MessageView from "@/components/items/MessageElement.vue";
import InfiniteLoading from "vue-infinite-loading";
import NavBar from "@/components/items/NavBar.vue";
import moment from "moment";

export default {
  name: "ConversationView",

  components: { MessageView, InfiniteLoading, NavBar },

  data() {
    return {
      ConvID: "",
      ConvName: "",
      convType: "cchat",
      selectedConv: null,
      convElems: [],
      version: localStorage.version,
      message: "Loading conversation...",
      messageComposerText: "",
      loadMinPosition: -1,
      loadMaxPosition: -1,
      refreshingConvList: false,
      timer: 1,
      usernamesList: {}
    };
  },

  // On creation :
  created: async function() {
    // load variables
    this.ConvID = localStorage.convID; // this.$route.params.ConvID;
    this.ConvName = localStorage.convName;
    this.convType = localStorage.convType;

    console.log(this.ConvName);

    // check if username is set
    if (localStorage.token === undefined || localStorage.url === undefined) {
      this.$router.push({ name: "Login" });
    }

    this.loadMessenger();
  },

  methods: {
    loadNewMessages() {
      // load new messages
      this.loadConversationMethod(1);
    },

    loadMessenger() {
      MClient.getThreadHistory(this.ConvID).then(async result => {
        // load document
        if (result.success) {
          // clean thread history
          for (let index = 0; index < result.convs.length; index++) {
            const element = result.convs[index];

            var data = {
              DataType: "text",
              Content: element.body,
              ConvID: this.ConvID,
              Username: await MClient.getUserName(element.senderID),
              senderID: element.senderID,
              UI_showUsername: true,
              UI_showDate: true,
              messenger: true,
              SendDateFormated: element.timestamp,
              messageReactions: element.messageReactions,
              isUnread: element.isUnread
            };

            this.convElems.push(data);
          }
        }

        this.ScrollToBottom();
      });
    },

    moveToConvSettings() {
      this.$router.push({ name: "ConvSettings" });
    },
    loadConversation() {
      this.loadConversationMethod();
    },

    getFormatedConv() {
      var localElem = localStorage.getItem("conv_" + this.ConvID);

      if (localElem != null) {
        var data = JSON.parse(localElem);

        //var lastDate = "";
        var user;
        var date;
        data.Messages.forEach(element => {
          // date formating
          var date_string = element.SendDate.replace(/ /g, "T");
          date_string = date_string.replace(/\//g, "-"); // replace the slash by "-"

          var d = new Date(element.SendDate);

          element.UI_showDate = true; // by default

          if (date != null) {
            var e = d - date;
            if (e < 1000 * 60 * 10) {
              // superior to 10 mins
              element.UI_showDate = false;
            } else {
              // we need to show the date : formating it...
              element.SendDateFormated = moment(date_string).fromNow();
            }
          } else {
            // first element initialisation
            element.UI_showDate = true;

            // display date :
            element.SendDateFormated = moment(date_string).fromNow();
          }

          // set date
          date = d;

          // display name ?

          element.UI_showUsername = true;
          if (element.Username == user) {
            element.UI_showUsername = false;
          }
          if (element.Username == localStorage.username)
            element.UI_showUsername = false;
          user = element.Username;
        });
        return data;
      }
      return null;
    },

    loadConversationMethod(toMove = 0) {
      var data = this.getFormatedConv();
      if (data != null) {
        // initialisation
        var amin = null;
        var amax = null;

        if (this.loadMinPosition == -1) {
          // initial loading
          console.log("Initial loading...");
          this.loadMaxPosition = data.Messages.length - 1;
          var initialLoad = 10;

          if (data.Messages.length > initialLoad) {
            this.loadMinPosition = data.Messages.length - initialLoad;
          } else {
            this.loadMinPosition = 0;
          }

          //this.ScrollToBottom();
          this.convElems = data.Messages.slice(this.loadMinPosition);
        } else {
          // we should load some old messages
          if (toMove < 0) {
            if (this.loadMinPosition + toMove >= 0) {
              amin = this.loadMinPosition + toMove;
              amax = this.loadMinPosition;
              this.loadMinPosition = this.loadMinPosition + toMove;
            }
            // load old elements
            // load elements to the top
            for (let index = amax - 1; index >= amin; index--) {
              this.convElems.unshift(data.Messages[index]);
            }
          } else if (toMove > 0) {
            console.log("To move, more");
            for (
              let index = this.loadMaxPosition + 1;
              index < data.Messages.length;
              index++
            ) {
              console.log("More : ", index);
              this.convElems.push(data.Messages[index]);
            }
            this.loadMaxPosition = data.Messages.length - 1;
          }
        }
      } else {
        console.log("Element is null");
      }
    },

    infiniteHandler($state) {
      if (this.loadMinPosition > 0) {
        // load a number of elements
        var a = -3; // should load a elements
        if (this.loadMinPosition + a < 0) {
          a = -this.loadMinPosition;
        }
        this.loadConversationMethod(a);
        $state.loaded();
      } else {
        $state.complete();
      }
    },

    sendMessage() {
      if (this.messageComposerText != "") {
        //cchat
        if (this.convType == "cchat") {
          Client.sendMessage(this.ConvID, this.messageComposerText);
          this.updateConv();
        }
        // messenger
        else if (this.convType == "messenger") {
          MClient.sendMessage(this.ConvID, this.messageComposerText);
          this.loadMessenger();
        }

        // empty the composer
        this.messageComposerText = "";
        this.ScrollToBottom();
      }
    },

    ScrollToBottom() {
      // scroll to end of the page
      window.scrollTo(0, document.body.scrollHeight);
    },

    addFiles() {
      this.$refs.img_files.click();
    },

    // update conv from server
    updateConv() {
      console.log("run : ", this.ConvID);
      // then load data from the internet
      Client.loadMessages(this.ConvID).then(result => {
        // load document
        if (result) {
          this.loadNewMessages();

          window.AppCenter.Analytics.trackEvent(
            "Conversation updating, loading"
          );
        }
      });
    },

    loadPicture(e) {
      var curFiles = e.target.files || e.dataTransfer.files;

      if (curFiles.length === 0) {
        console.log("No files currently selected for upload");
      } else {
        for (var i = 0; i < curFiles.length; i++) {
          new Compressor(curFiles[i], {
            quality: 0.6,
            success(result) {
              //The res in the promise is a compressed Blob type (which can be treated as a File type) file;
              Client.SendPicture(localStorage.convID, result).then(function(
                result
              ) {
                console.log("Image sent :", result);
                this.updateConv();
              });
            },
            error(err) {
              console.log(err.message);
            }
          });

          //image.src = window.URL.createObjectURL(curFiles[i]);
        }
      }
    }
  }
};

//document.querySelector("#input_image").addEventListener("change", loadPicture);
</script>
