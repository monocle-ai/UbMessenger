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
                    >{{conv.last_message_user}} : {{conv.last_message_text}}</span>
                  </p>
                </div>
              </div>
              <div class="media-right">
                <span v-if="conv.unreadCount > 0" class="dot"></span>
              </div>
            </article>
          </a>
          <infinite-loading @infinite="infiniteHandler"></infinite-loading>
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
import MClient from "@/js/messengerClient";
import NavBar from "@/components/items/NavBar.vue";
import InfiniteLoading from "vue-infinite-loading";

//import MessengerClient from "@/js/messenger.js";

export default {
  name: "ConversationsList",
  components: { NavBar, InfiniteLoading },

  data() {
    return {
      selectedConv: null,
      convs: [],
      version: localStorage.version,
      message: "Loading conversations...",
      lastMessageTimestamp: null,
      canLoad: true,
      isLoading: false
    };
  },

  created: function() {
    if (localStorage.url === undefined || localStorage.token === undefined) {
      this.$router.push("Login");
    }

    var elem = localStorage.convsList;
    if (elem != null) {
      this.convs = JSON.parse(elem);
      this.message = "";
    }

    //this.loadConversationList();
  },

  methods: {
    async loadConversationList() {
      var result = await MClient.listConversations(
        5,
        this.lastMessageTimestamp,
        []
      ).then(async result => {
        // end loading
        return result;
      });

      if (result == null || result.success == false) {
        this.message = "Problem loading messenger messages";
        return false;
      } else {
        // adapt data in order to be displayed

        //console.log(this.convs);
        this.message = "";
      }

      for (let index = 0; index < result.convs.length; index++) {
        const element = result.convs[index];

        var data = {
          ConvName: element.name,
          ConvID: element.threadID,
          last_message_text: element.snippet,
          last_message_user: await MClient.getUserName(element.snippetSender),
          imageSrc: element.imageSrc,
          unreadCount: element.unreadCount
        };

        if (element.imageSrc == null) {
          data.imageSrc = element.participants[0].profilePicture;
        }

        // update list
        this.convs.push(data);
        this.lastMessageTimestamp = parseInt(element.timestamp);
      }

      // check if there is other conversations to load
      if (result.convs.length == 0) this.canLoad = false;
      return true; // indicate success
    },

    clickedPlace(conv) {
      localStorage.convID = conv.ConvID;
      localStorage.convName = conv.ConvName;

      //changePage();
      this.$router.push({ name: "ConvView", params: { ConvID: conv.ConvID } });
    },

    async infiniteHandler($state) {
      if (this.canLoad) {
        // load more conversations
        console.log("going to load...");
        var a = await this.loadConversationList();
        if (a == false) {
          console.log("error");
        }

        $state.loaded();
      } else {
        console.log("completed");
        $state.complete();
      }
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
  background-color: rgba(55, 1, 249, 0.71);
  border-radius: 50%;
  display: inline-block;
}

.conv-image {
  height: 50px;
  width: 50px;
}
</style>