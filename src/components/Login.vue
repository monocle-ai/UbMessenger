<template>
  <div>
    <NavBar PageName="Login" />

    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Welcome in UbMessenger</h1>
          <h2 class="subtitle">Please enter the server address and credential</h2>
        </div>
      </div>
    </section>

    <div class="section">
      <h2 class="title">Login :</h2>
      <form id="vue-username" @submit.prevent="login">
        <strong>Server address :</strong>
        <div class="control has-icons-left">
          <input class="input" type="url" v-model="url" />
          <span class="icon is-small is-left has-text-dark">
            <font-awesome-icon :icon="['fas','user']" />
          </span>
        </div>
        <br />

        <strong>Password :</strong>
        <div class="control has-icons-left">
          <input class="input" type="text" v-model="token" />
          <span class="icon is-small is-left has-text-dark">
            <font-awesome-icon :icon="['fas','lock']" />
          </span>
        </div>
        <br />

        <div class="buttons">
          <button v-on:click="login()" class="button is-primary">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/items/NavBar.vue";

export default {
  name: "Login",
  components: { NavBar },

  data() {
    return {
      selectedConv: null,
      convs: [],
      version: localStorage.version,
      url: "https://yourdomain.fr:8073/",
      token: ""
    };
  },
  created: function() {
    if (localStorage.token !== undefined && localStorage.url !== undefined) {
      // token is set
      this.changePage();
    }
    // else, stay here and ask use to fill token and url
  },
  methods: {
    login() {
      localStorage.url = this.url;
      localStorage.token = this.token;

      // TODO : check if token and url are valid
      this.changePage();
    },


    // go to the next page
    changePage() {
      this.$router.push({ name: "ConvList" });
    }
  }
};
</script>
