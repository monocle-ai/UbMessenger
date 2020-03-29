<template>
  <div>
    <NavBar PageName="UbMessenger" SecondActionName="Settings" SecondActionPath="Settings" />
   
    <section>
      <div id="app">
        <div class="conv-list">
          <a
            class="conv-item "
            href="#"
            @click="clickedPlace(conv)"
            :key="conv.ConvID"
            v-for="conv in convs"
          >


            <div class="has-text-black">
              <h2 class="has-text-weight-bold is-size-5">{{ conv.ConvName }}</h2>
              <span class="has-text-weight-bold">{{ conv.last_message_user }}</span>
              : {{ conv.last_message_text }}
            </div>
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
        if (localStorage.token === undefined || localStorage.url === undefined) {
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

      MClient.listConversations().then(result => {
        if (result == null || result.success == false) {
          this.message = "Problem loading messenger messages";
        } else {
          // adapt data in order to be displayed
          result.convs.forEach(element => {
            var data = {
              ConvName: element.name,
              ConvID: element.threadID,
              last_message_text: element.snippet,
              last_message_user: element.snippetSender,
              convType: "messenger"
            };

            // update list
            this.convs.push(data);
          });

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
      if(conv.convType == "messenger"){
        localStorage.convType = "messenger";
      }
      
      //changePage();
      this.$router.push({ name: "ConvView", params: { ConvID: conv.ConvID } });
    }
  }
};
</script>


<style scoped>
.conv-list{
  border-radius: 4px;
}

.conv-item{
  background-color: white;
  display: block;
padding: 0.5em 1em;
}

</style>