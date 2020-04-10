<template>
  <div>
    <NavBar PageName="UbMessenger" SecondActionName="Settings" SecondActionPath="Settings" />
    <form class="container">
      <div class="control has-icons-right">
        <input
          class="input"
          type="text"
          v-model="searchText"
          v-on:input="loadData()"
          placeholder="Search a converation name"
        />
        <span class="icon is-small is-right has-text-dark">
          <font-awesome-icon :icon="['fas','search']" />
        </span>
      </div>
    </form>

    <section class="section" v-if="searchText !=''">
      <div class="conv-list">
        <h2 class="subtitle">Users</h2>
        <a
          class="conv-item"
          href="#"
          @click="clickedPlace(conv)"
          :key="conv.ConvID"
          v-for="conv in searchConvs_users"
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
                  <br />
                </p>
              </div>
            </div>
          </article>
        </a>

        <h2 class="subtitle">Groups</h2>
        <a
          class="conv-item"
          href="#"
          @click="clickedPlace(conv)"
          :key="conv.ConvID"
          v-for="conv in searchConvs_groups"
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
                  <br />
                </p>
              </div>
            </div>
          </article>
        </a>

        <h2 class="subtitle">Pages</h2>
        <a
          class="conv-item"
          href="#"
          @click="clickedPlace(conv)"
          :key="conv.ConvID"
          v-for="conv in searchConvs_pages"
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
                  <br />
                </p>
              </div>
            </div>
          </article>
        </a>
      </div>
    </section>

    <section>
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
                  <br />
                  <span
                    v-bind:class="{'has-text-weight-bold':conv.unReadCount > 0}"
                  >{{conv.last_message_user}} : {{conv.last_message_text}} - {{conv.last_message_date}}</span>
                </p>
              </div>
            </div>
            <div class="media-right">
              <span v-if="conv.unreadCount > 0" class="dot"></span>
            </div>
          </article>
        </a>

        <infinite-loading @infinite="infiniteHandler">
          <div slot="spinner">Loading...</div>
          <div slot="no-more">No more message</div>
          <div slot="no-results">No results message</div>
        </infinite-loading>
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

import moment from "moment";
//import MessengerClient from "@/js/messenger.js";

export default {
  name: "ConversationsList",
  components: { NavBar, InfiniteLoading },

  data() {
    return {
      selectedConv: null,
      convs: [],

      searchConvs_groups: [],
      searchConvs_users: [],
      searchConvs_pages: [],

      searchText: "",
      version: localStorage.version,
      message: "Loading conversations...",
      lastMessageTimestamp: null,

      mutex: false
    };
  },

  created: function() {
    if (localStorage.url === undefined || localStorage.token === undefined) {
      this.$router.push("Login");
    }
  },

  methods: {
    async loadData() {
      if (this.mutex == false) {
        this.mutex = true;

        if (this.searchText == "") {
          await this.loadConversationList();
        } else {
          await this.searchConversation();
        }

        this.mutex = false;
        return true;
      }
      return false;
    },

    async loadConversationList() {
      var result = await MClient.listConversations(
        5,
        this.lastMessageTimestamp,
        []
      ).then(async result => {
        // end loading
        return result;
      });

      // we scroll

      // initialisation
      this.searchConvs_users = [];
      this.searchConvs_groups = [];
      this.searchConvs_pages = [];

      if (this.convs.length == 0) this.lastMessageTimestamp = null;

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

        var date = moment(parseInt(element.timestamp));

        var data = {
          ConvName: element.name,
          ConvID: element.threadID,
          last_message_text: element.snippet,
          last_message_user: await MClient.getUserName(element.snippetSender),
          last_message_date: date.fromNow(),
          imageSrc: element.imageSrc,
          unreadCount: element.unreadCount
        };

        if (element.imageSrc == null) {
          data.imageSrc = element.participants[0].profilePicture;
        }

        // update list
        this.convs.push(data);
        this.lastMessageTimestamp = parseInt(element.timestamp);
        this.isLoading = false;
      }

      return true; // indicate success
    },

    clickedPlace(conv) {
      localStorage.convID = conv.ConvID;
      localStorage.convName = conv.ConvName;

      //changePage();
      this.$router.push({ name: "ConvView", params: { ConvID: conv.ConvID } });
    },

    async searchConversation() {
      await MClient.searchForThread(this.searchText, 6, 4, 4)
        .then(async result => {
          this.convs = [];

          this.searchConvs_users = [];
          this.searchConvs_groups = [];
          this.searchConvs_pages = [];

          console.log(result);
          for (let index = 0; index < result.convs.length; index++) {
            const element = result.convs[index];

            var data = {
              ConvName: element.name,
              ConvID: element.userID,
              imageSrc: element.imageSrc,
              unReadCount: element.unreadCount
            };

            console.log(element.accountType);

            if (element.accountType == "User") {
              this.searchConvs_users.push(data);
            } else if (element.accountType == "MessengerViewerGroupThread") {
              this.searchConvs_groups.push(data);
            } else if (element.accountType == "Page") {
              console.log(data);
              this.searchConvs_pages.push(data);
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    async infiniteHandler($state) {
      if (this.searchText == "") {
        // load more conversations
        console.log("going to load...");
        var a = await this.loadData();

        if (a == false) {
          console.log("error");

          $state.complete();
          return;
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