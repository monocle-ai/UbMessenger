<template>
  <div>
    <NavBar PageName="UbMessenger" SecondActionName="Settings" SecondActionPath="Settings" />

    <section>
      <div id="app">
        <div class="conv-list">
          <a
            class="conv-item"
            href="#"
            @click="clickedPlace(conv)"
            :key="conv.ConvID"
            v-for="conv in convs"
          >
            <article class="media">
              <figure class="media-left">
                <p class="image conv-image">
                  <img class="is-rounded" :src="conv.imageSrc" />
                </p>
              </figure>
              <div class="media-content">
                <div class="content has-text-black">
                  <p>
                    <strong class="is-size-5">{{conv.ConvName}}</strong>
                    <small>{{conv.last_message_date}}</small>
                    <br />
                    <span
                      v-bind:class="{'has-text-weight-bold':conv.unreadCount > 0}"
                    >@{{conv.last_message_user}} : {{conv.last_message_text}}</span>
                  </p>
                </div>
              </div>
              <div class="media-right">
                <span v-if="conv.unreadCount > 0" class="dot"></span>
              </div>
            </article>
          </a>
        </div>
      </div>
    </section>
    <section class="section">
      <p>{{message}}</p>App version :
      <strong>{{version}}</strong>
    </section>
  </div>
</template>

<script>
import Client from "@/js/client.js";
import MClient from "@/js/messengerClient";
import NavBar from "@/components/items/NavBar.vue";

//import MessengerClient from "@/js/messenger.js";

export default {
  name: "ConversationsList",
  components: { NavBar },

  data() {
    return {
      selectedConv: null,
      convs: [],
      version: localStorage.version,
      message: "Loading conversations..."
    };
  },
  created: function() {
    var elem = localStorage.convsList;
    if (elem != null) {
      this.convs = JSON.parse(elem);
      this.message = "";
    }
    this.loadConversationList();
  },
  methods: {
    loadConversationList() {
      Client.loadConversationsList().then(result => {
        if (
          localStorage.token === undefined ||
          localStorage.url === undefined
        ) {
          // cannot access the server properly
          console.log("Sent back to login");

          this.$router.push({ name: "Login" });
        }

        if (result == null || result.success == false) {
          this.message = "Problem loading messages";
        } else {
          this.convs = result.convs;
          //console.log(this.convs);
          this.message = "";
        }
      });

      MClient.listConversations().then(async result => {
        if (result == null || result.success == false) {
          this.message = "Problem loading messenger messages";
        } else {
          // adapt data in order to be displayed
          for (let index = 0; index < result.convs.length; index++) {
            const element = result.convs[index];

            

            var data = {
              ConvName: element.name,
              ConvID: element.threadID,
              last_message_text: element.snippet,
              last_message_user: await MClient.getUserName(
                element.snippetSender
              ),
              imageSrc: element.imageSrc,
              convType: "messenger",
              unreadCount: element.unreadCount
            };

            if(element.imageSrc == null){
             data.imageSrc = element.participants[0].profilePicture; 
            }

            // update list
            this.convs.push(data);
          }

          //console.log(this.convs);
          this.message = "";
        }
      });
    },
    async addConversation() {
      if (
        await Client.addConversation("New conv", [
          "henri2h",
          "marin",
          "quentin"
        ])
      ) {
        this.loadConversationList();
        console.log("Success");
      }
    },
    clickedPlace(conv) {
      localStorage.convID = conv.ConvID;
      localStorage.convName = conv.ConvName;
      localStorage.convType = "cchat"; // default

      // change conv type if messenger
      if (conv.convType == "messenger") {
        localStorage.convType = "messenger";
      }

      //changePage();
      this.$router.push({ name: "ConvView", params: { ConvID: conv.ConvID } });
    }
  }
};
</script>


<style scoped>
.conv-list {
  border-radius: 4px;
}

.conv-item {
  background-color: white;
  display: block;
  padding: 0.5em 1em;
  font-family: Arial;
  word-wrap: break-word;
}
.dot {
  height: 14px;
  width: 14px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
}

.conv-image{
height: 50px;
width: 50px;
}
</style>