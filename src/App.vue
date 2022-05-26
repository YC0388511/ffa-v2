<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <ProjectView />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import "@babylonjs/core";
import "@babylonjs/loaders";
import ProjectView from "@/components/ProjectView.vue";

export default defineComponent({
  name: "App",
  components: {
    ProjectView,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  background-color: rgb(18, 22, 31);
}
</style>
