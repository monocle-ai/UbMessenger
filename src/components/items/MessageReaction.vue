<template>
  <div class="reaction-container">
    <div v-for="(value, name) in elements" :key="name"><span class="icon-reaction">{{ name }}</span> {{ value }}</div>
  </div>
</template>

<script>
export default {
  name: "MessageReaction",
  data() {
    return {
      elements: {}
    };
  },
  props: ["reactions"],
  created: function() {
    for (let index = 0; index < this.reactions.length; index++) {
      const element = this.reactions[index];
      if (this.elements[element.reaction] !== undefined)
        this.elements[element.reaction] += 1;
      else this.elements[element.reaction] = 1;
    }
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
