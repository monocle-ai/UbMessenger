<template>
  <div>
    <NavBar
      :PageName="ConvName"
      MainActionPath="ConvList"
      SecondActionName="ConvSetting"
      SecondActionPath="ConvSettings"
    />
    <section class="section">
      <infinite-loading
        @infinite="infiniteHandler"
        direction="top"
      ></infinite-loading>
      <div v-for="element in convElems" :key="element.timestamp">
        <MessageView :message="element" />
      </div>
    </section>

    <br />
    <br />

    <br />

    <nav
      class="navbar is-fixed-bottom"
      role="navigation"
      aria-label="main navigation"
    >
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
            <button
              class="button is-info has-text-white"
              v-on:click="addFiles()"
            >
              <font-awesome-icon :icon="['fas', 'image']" />
            </button>
          </div>
          <form class="control is-expanded" @submit.prevent="sendMessage()">
            <p class="control has-icons-left has-icons-right">
              <input
                class="input"
                type="text"
                v-model="messageComposerText"
                placeholder="Message"
              />
              <span class="icon is-small is-left">
                <font-awesome-icon :icon="['fas', 'comment-alt']" />
              </span>
              <span class="icon is-small is-right">
                <font-awesome-icon :icon="['fas', 'check']" />
              </span>
            </p>
          </form>
          <div class="control">
            <button class="button is-info" v-on:click="sendMessage()">
              Send
            </button>
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
      usernamesList: {},

      timestamp: null,
      canLoad: true,
      mutex: false
    };
  },

  // On creation :
  created: async function() {
    // load variables
    this.ConvID = localStorage.convID; // this.$route.params.ConvID;
    this.ConvName = localStorage.convName;
    this.convType = localStorage.convType;

    // check if username is set
    if (localStorage.token === undefined || localStorage.url === undefined) {
      this.$router.push({ name: "Login" });
    }

    this.ScrollToBottom();
  },

  methods: {
    loadNewMessages() {
      // load new messages
      this.loadConversationMethod(1);
    },

    async loadMessenger() {
      if (this.mutex == false) {
        this.mutex = true;
        await MClient.getThreadHistory(this.ConvID, 10, this.timestamp).then(
          async result => {
            // load document
            if (result.success) {
              var convs = result.data.messages;
              var readReceipts = result.data.readReceipts;

              if (convs.length > 0) this.timestamp = convs[0].timestamp;
              else this.canLoad = false;

              // clean thread history
              for (let index = convs.length - 1; index >= 0; index--) {
                const element = convs[index];

                var date = moment(parseInt(element.timestamp));

                var data = {
                  DataType: "text",
                  Content: element.body,
                  ConvID: this.ConvID,

                  Username: await MClient.getUserName(element.senderID),
                  senderID: element.senderID,

                  UI_showUsername: true,
                  UI_showDate: true,
                  messenger: true,
                  attachments: element.attachments,
                  SendDateFormated: date.fromNow(),
                  messageReactions: element.messageReactions,
                  isUnread: element.isUnread,
                  timestamp: parseInt(element.timestamp),
                  readBy: []
                };

                // get read status
                let read_index = 0;

                while (read_index < readReceipts.length) {

                 if (
                    parseInt(element.timestamp) ==
                    parseInt(readReceipts[read_index].watermark)
                  ) {
                    /*console.log(
                      readReceipts[read_index].id,
                      await MClient.getUserName(readReceipts[read_index].id)
                    );*/

                    var rData = {
                      id: readReceipts[read_index].id,
                      vueID: "readR_" + readReceipts[read_index].id,
                      name: await MClient.getUserName(
                        readReceipts[read_index].id
                      ),
                      watermark: readReceipts[read_index].watermark,
                      action: readReceipts[read_index].action,
                      date: moment(
                        parseInt(readReceipts[read_index].action)
                      ).fromNow()
                    };
                    data.readBy.push(rData);

                    readReceipts.splice(read_index, 1); // remove current item
                  } else read_index++;
                }

                // in case of type = event
                if (element.type == "event") {
                  console.log(element);
                  data.Content = element.snippet;
                  data.Username = "server";
                  data.messageReactions = [];
                }

                this.convElems.unshift(data);
              }

            }
            return true;
          }
        );
        this.mutex = false;
      }
    },

    moveToConvSettings() {
      this.$router.push({ name: "ConvSettings" });
    },

    async infiniteHandler($state) {
      if (this.canLoad) {
        await this.loadMessenger();
        $state.loaded();
      } else {
        $state.complete();
      }
    },

    async sendMessage() {
      if (this.messageComposerText != "") {
        await MClient.sendMessage(this.ConvID, this.messageComposerText).then(
          result => {
            console.log(result);
          }
        );

        // empty the composer
        this.messageComposerText = "";

        // we need to refresh the screen
        this.convElems = []; // TODO: implement a better way to refresh the conversation list
        this.timestamp = null;
        //await this.loadMessenger(); // no need to refresh, the infinite loader take care of this...

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
