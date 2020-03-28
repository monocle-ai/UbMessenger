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

    <section class="section" id="vue-settings">
      <button class="button is-danger" v-on:click="resetName">Reset name</button>
    </section>
  </div>
</template>

<script>
import NavBar from "@/components/items/NavBar.vue";

export default {
  data() {
    return {};
  },
  components: { NavBar },
  methods: {
    resetName: function() {
      localStorage.username = "";
      this.goStartPage();
    },
    goStartPage() {
      this.$router.push({ name: "ConvList" });
    }
  }
};
</script>
