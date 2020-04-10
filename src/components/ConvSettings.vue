<template>
  <div>
    <NavBar PageName="ConvSettings" MainActionPath="ConvView" />
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">CChat</h1>
          <h2 class="subtitle">Conversation : {{ convName }}</h2>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="subtitle">Users</h2>
      <div class="list">
        <p class="list-item list-item-action" :key="user.id" v-for="user in users">{{ user.name }}</p>
      </div>
    </section>
    <section class="section">
      <h2 class="subtitle">Nicknames</h2>
      <div class="list">
        <p class="list-item list-item-action" :key="user.id" v-for="user in nicknames">{{ user.name }} : {{user.nickname}}</p>
      </div>
    </section>

    <section class="section">
      <div class="field has-addons">
        <div class="control">
          <input class="input" v-model="convName" placeholder="Conversation name" />
        </div>
        <div class="control">
          <button class="button is-info" v-on:click="changeConvName">Save</button>
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Danger zone :</h2>
      <button class="button is-danger">Delete conversation</button>
    </section>
  </div>
</template>

<script>
import MClient from "@/js/messengerClient.js";
import NavBar from "@/components/items/NavBar.vue";

export default {
  name: "ConvSettings",
  components: { NavBar },

  data() {
    return {
      convID: localStorage.convID,
      convName: localStorage.convName,
      users: [],
      nicknames:[]
    };
  },
  created: function() {
    MClient.getThreadInfo(this.convID).then(async result => {
      if (result.success == true) {
        var info = result.convInfo;
        console.log(info);
        for (let index = 0; index < info.participantIDs.length; index++){
          const element = info.participantIDs[index];
          console.log(element);
          console.log(await MClient.getUserName(element));
          this.users.push({name:await MClient.getUserName(element), id:element});
        }
        for (var id in info.nicknames){
          console.log(id, info.nicknames[id]);
          this.nicknames.push({name:await MClient.getUserName(id), id:id, nickname: info.nicknames[id]});
        }
    }
    });
  },
  methods: {
    changeConvName: function() {
      console.log("Not implemented");
      //Client.setConversationName(this.convID, this.convName);
    }
  }
};
</script>

