<template>
  <div>
    <h3>Forensics Project</h3>
    <canvas />
    <textarea cols="30" rows="10" readonly>
Use WASD to move around and move the mouse to control where you're looking.
A debug menu can be toggle via the B key to view general information.
Note: Some things may appear white due to missing textures.
    </textarea>
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
textarea {
  color: rgb(234, 234, 234);
  background-color: rgb(18, 22, 31);
}
</style>
