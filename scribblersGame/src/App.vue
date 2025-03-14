<template>
  <!-- Main application component that includes the ScribblersApp component -->
  <ScribblersApp></ScribblersApp>
</template>

<script>
// Importing the ScribblersApp component
import ScribblersApp from "./components/ScribblersApp.vue";

export default {
  name: "App", // Defining the name of the component
  components: {
    ScribblersApp // Registering ScribblersApp as a child component
  },
};
</script>

<style>
/* Reset default margin for body */
body {
  margin: 0px;
}

/* Styling for the main app container */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif; /* Defines the font stack */
  -webkit-font-smoothing: antialiased; /* Improves font rendering in WebKit browsers */
  -moz-osx-font-smoothing: grayscale; /* Improves font rendering in macOS */
  color: #2c3e50; /* Sets the default text color */
  margin-top: 10px; /* Adds some spacing at the top */
}
</style>
