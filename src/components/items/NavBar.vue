<template>
  <nav class="navbar is-fixed-top">
    <div class="navbar-brand">
      <a class="navbar-item" v-on:click="moveToMainAction()">{{PageName}}</a>
      <div
        class="navbar-burger burger is-hidden"
        data-target="navMenu"
        v-bind:class="{'is-hidden': !SecondActionSet }"
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div class="navbar-end to-right" v-bind:class="{'is-hidden': !SecondActionSet }">
        <div class="navbar-item">
          <a class="button" v-on:click="moveToSecondAction()">
            <span class="icon">
              <font-awesome-icon :icon="['fas','cog']" />
            </span>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      SecondActionSet: false
    };
  },

  mounted: function() {
    if (this.SecondActionName != null) {
      this.SecondActionSet = true;
    }
  },

  props: ["PageName", "MainActionPath", "SecondActionName", "SecondActionPath"],
  methods: {
    moveToSecondAction() {
      this.$router.push(this.SecondActionPath);
      //closeNavBar();
    },
    moveToMainAction() {
      this.$router.push({ name: this.MainActionPath });
    }
  }
};
</script>

<style scoped>
.to-right {
  display: block;
  position: absolute;
  right: 0px;
}
</style>