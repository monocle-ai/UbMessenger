<template>
  <div>
    <NavBar PageName="Login" />

    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Welcome in CChat</h1>
          <h2 class="subtitle">Please enter your credentials</h2>
        </div>
      </div>
    </section>

    <div class="section">
      <h2 class="title">Login :</h2>
      <form id="vue-username" @submit.prevent="login">
        <strong>Username :</strong>
        <div class="control has-icons-left">
          <input class="input" type="text" v-model="usernameInput" />
          <span class="icon is-small is-left has-text-dark">
            <font-awesome-icon :icon="['fas','user']" />
          </span>
        </div>
        <br />

        <strong>Password :</strong>
        <div class="control has-icons-left">
          <input class="input" type="password" v-model="passwordInput" />
          <span class="icon is-small is-left has-text-dark">
            <font-awesome-icon :icon="['fas','lock']" />
          </span>
        </div>
        <br />

        <div class="buttons">
          <button v-on:click="register()" class="button is-hidden is-info">Register</button>
          <button v-on:click="login()" class="button is-primary">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Client from "@/js/client.js";
import NavBar from "@/components/items/NavBar.vue";

export default {
  name: "Login",
  components: { NavBar },

  data() {
    return {
      selectedConv: null,
      convs: [],
      version: localStorage.version,
      usernameInput: "",
      passwordInput: ""
    };
  },
  created: function() {
    if (
      (localStorage.getItem("username") == null) == false &&
      localStorage.username != ""
    ) {
      // no need to ask for credentials, just connect, get token and go to get to the next page
      this.connect();
      this.message = "Please update credentials";
    }
  },
  methods: {
    login() {
      localStorage.username = this.usernameInput;
      localStorage.password = this.passwordInput;

      this.connect();
    },

    register() {
      console.log("To implement");
    },

    connect() {
      var success = true;
      this.token = "token";
      if (success) {
        if (window.canUseCordova) {
          if (localStorage.firebaseID !== null) {
            // register firebaseid :
            console.log("Firebase id from local storage :");
            Client.connect(localStorage.firebaseID);

            // log it to server
            window.AppCenter.Analytics.trackEvent("FirebaseID sent to server", {
              FirebaseID: localStorage.firebaseID,
              Username: localStorage.username
            });
          } else {
            console.log("FirebaseID not set !!");
            window.AppCenter.Analytics.trackEvent("FirebaseID not set !!");
          }
        } else {
          console.log("Could not use cordova...");
        }

        this.changePage();
      } else {
        this.message = "Authentification failed";
        console.log("Authentification failed");
        window.AppCenter.Analytics.trackEvent("Authentification failed");
      }
    },

    // go to the next page
    changePage() {
      this.$router.push({ name: "ConvList" });
    }
  }
};
</script>
