<template>
  <div>
    <NavBar PageName="Login" />

    <section class="hero color-blue">
      <div class="hero-body">
        <div class="container">
          <h1 class="title has-text-white">Welcome in UbMessenger</h1>
          <h2 class="subtitle has-text-white">Please enter the server address and credential</h2>
        </div>
      </div>
    </section>

    <div class="section">
      <h2 class="title">Login :</h2>
      <form id="vue-username" @submit.prevent="login()">
        <strong>Server address :</strong>
        <div class="control has-icons-left">
          <input class="input" type="url" v-model="url" />
          <span class="icon is-small is-left has-text-dark">
            <font-awesome-icon :icon="['fas','user']" />
          </span>
        </div>
        <br />

        <strong>Token :</strong>
        <div class="control has-icons-left">
          <input class="input" type="text" v-model="token" />
          <span class="icon is-small is-left has-text-dark">
            <font-awesome-icon :icon="['fas','lock']" />
          </span>
        </div>
        {{message}}
        <br />
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
import MClient from "@/js/messengerClient";

export default {
  name: "Login",
  components: { NavBar },

  data() {
    return {
      version: localStorage.version,
      url: "https://yourdomain.fr:8073/",
      token: "",
      message: ""
    };
  },
  created: function() {
    if (localStorage.token !== undefined && localStorage.url !== undefined) {
      this.changePage();
    }
    // else, stay here and ask use to fill token and url
  },
  methods: {
    async login() {
      localStorage.url = this.url;
      localStorage.token = this.token;

      var result = await MClient.listConversations(10, null, []);
      var usernameResult = await MClient.getCurrentUserID();
      console.log(result.success);

      // TODO : check if token and url are valid
      if (result.success && usernameResult.success) {
        localStorage.userid = usernameResult.user;
        this.changePage();
      } else {
        // not valid...
        localStorage.removeItem("url");
        localStorage.removeItem("token");
        this.message = result.error;
      }
    },

    // go to the next page
    changePage() {
      this.$router.push({ name: "ConvList" });
    }
  }
};
</script>