<!-- Used by App.vue -->

<template>
  <div class="greetings">
    <RouterLink to="/" class="title-button">Scribblers!</RouterLink>
  </div>
</template>

<style scoped>

.title-button {
  font-weight: 500;
  /* font-size: 2.6rem; */
  position: relative;
  /* top: 75px;
  left: 100px; */
  text-decoration: none;
  margin-bottom: 0px; /* Adds some space between the title and choose string */
  font-size: 50px;
  font-weight: bold;
  font-family: 'Segoe UI', sans-serif;
  color: #000;
}

.title-button:hover {
  color: rgb(76, 75, 75);
  transform: scale(1.05);
}

.greetings{
  margin: auto;
  width: 50%;
  padding: 10px;
}

</style>
