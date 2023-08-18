<template>
  <div id="app">
    <Navigation />
    <Status />
    <MutationWindow />
    <DeleteWindow />
    <router-view class="px-24 py-10"/>
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";
import Status from "./components/StatusCard.vue" 
import MutationWindow from "./components/MutationWindow.vue";
import DeleteWindow from "./components/DeleteWindow.vue";

import { mapActions } from "vuex";

export default {
  name: "App",
  components: {
    Navigation,
    Status,
    MutationWindow,
    DeleteWindow
  },
  mounted() {
    this.login({});
  },
  methods: {
    ...mapActions("user", ["login"])
  }
};
</script>

<style src="./assets/tailwind.css"></style>