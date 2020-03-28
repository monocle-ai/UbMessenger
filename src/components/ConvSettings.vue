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
        <p class="list-item list-item-action" :key="user" v-for="user in users">{{ user }}</p>
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
import Client from "@/js/client.js";
import NavBar from "@/components/items/NavBar.vue";

export default {
  name: "ConvSettings",
  components: { NavBar },

  data() {
    return {
      convID: localStorage.convID,
      convName: localStorage.convName,
      users: []
    };
  },
  created: function() {
    var localElem = localStorage.getItem("conv_" + localStorage.convID);
    if (localElem != null) {
      var data = JSON.parse(localElem);
      //console.log(data);
      this.users = data.Usernames;
    }
  },
  methods: {
    changeConvName: function() {
      Client.setConversationName(this.convID, this.convName);
    }
  }
};
</script>

