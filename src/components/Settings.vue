<template>
  <div>
    <NavBar PageName="Settings" MainActionPath="ConvList" />
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">App settings</h1>
        </div>
      </div>
    </section>
  
    <form class="section" @submit.prevent="setUserid">
      <strong>User id:</strong>
      <div class="control has-icons-left">
        <input class="input" type="text" v-model="userid" />
        <span class="icon is-small is-left has-text-dark">
          <font-awesome-icon :icon="['fas','user']" />
        </span>
      </div>
    </form>

    <section class="section" id="vue-settings">
      <button class="button is-danger" v-on:click="resetName">Reset name</button>
    </section>
  </div>
</template>

<script>
import NavBar from "@/components/items/NavBar.vue";

export default {
  data() {
    return {
      "userid":localStorage.userid
    };
  },
  components: { NavBar },
  methods: {
    resetName: function() {
      
      localStorage.removeItem("token");
      localStorage.removeItem("url");

console.log(localStorage.url);
      this.goStartPage();
    },
    goStartPage() {
      this.$router.push({ name: "ConvList" });
    },
    setUserid(){
      localStorage.userid = this.userid;
    }
  }
};
</script>
