<template>
  <div>
    <h3>Forensics Project</h3>
    <canvas/>
  </div>
</template>

<script lang="ts">
import { MainScene } from "@/Scenes/MainScene";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ProjectView",
  mounted() {
    const canvas = document.querySelector("canvas")!;
    new MainScene(canvas);
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  width: 85%;
}
h3 {
  margin: 40px 0 0;
  color: rgb(234, 234, 234);
}
</style>
