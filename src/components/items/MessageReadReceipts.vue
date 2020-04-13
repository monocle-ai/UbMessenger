<template>
  <div class="reaction-container">
    <div v-for="rd in readReceipts" :key="rd.vueID"><span class="icon-reaction">{{ rd.name }}</span> {{ rd.date }}</div>
  </div>
</template>

<script>
export default {
  name: "MessageReadReceipts",
  data() {
    return {
      elements: {}
    };
  },
  props: ["readReceipts"],
  created: function() {
   
  }
};
</script>
<style scoped>
.reaction-container {
  color: black;
  background-color: white;
  padding: 0.4rem 0.5rem;
  border-radius: 25px;
}
.icon-reaction{
  font-family: initial;
}
</style>
