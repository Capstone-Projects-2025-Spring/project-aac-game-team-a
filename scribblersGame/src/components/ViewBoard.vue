<script setup>
import { ref, onMounted, onUnmounted, inject } from "vue";


const imageSrc = ref(null);

onMounted(() => {
    const socket = inject("socket"); // Inject the socket instance
    // Listen for incoming image data from the server
    socket.on("imageData", (data) => {
        console.log("Received image data");
        imageSrc.value = `${data}`; // Adjust if different format
    });
});

onUnmounted(() => {
  socket.off("imageData"); // Cleanup listener
});
</script>

<template>
  <div>
    <h2>Received Image</h2>
    <img v-if="imageSrc" :src="imageSrc" alt="Received image" />
    <p v-else>No image received yet</p>
  </div>
</template>
