<template>
  <div id="app">
    <Navigation />
    <router-view class="px-24 py-10"/>
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";
export default {
  name: "App",
  components: {
    Navigation,
  },
};
</script>

<style src="./assets/tailwind.css"></style>