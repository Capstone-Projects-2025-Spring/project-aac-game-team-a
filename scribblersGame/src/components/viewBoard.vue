<script setup>
import { ref, onMounted, onUnmounted, inject } from "vue";


// const imageSrc = ref(null);
console.log("item about to be created")
const props = defineProps({
  imageFromParent: String, // Accepts Base64 or URL
});
const imageSrc = ref(props.imageFromParent || null);

// Watch for changes in the parent prop and update the image
watch(() => props.imageFromParent, (newImage) => {
  if (newImage) {
    imageSrc.value = newImage;
  }
});

onMounted(() => {
    const socket = inject("socket"); // Inject the socket instance
    // Listen for incoming image data from the server
    socket.on("draw_data:received", (data) => {
        console.log("Received image data");
        imageSrc.value = `${data}`; // Adjust if different format
    });
});

onUnmounted(() => {
  socket.off("draw_data:received"); // Cleanup listener
});
</script>

<template>
  <div>
    <h2>Received Image</h2>
    <img v-if="props.imageFromParent" :src="props.imageFromParent" alt="Received image" />
    <p v-else>No image received yet</p>
  </div>
</template>
