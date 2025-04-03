<!-- Used by App.vue -->

<!-- <template>
  <div class="greetings">
    <img class="icon" src="/scribblersIcon.png" alt="scribblersIcon">
    <RouterLink to="/" class="title-button">Scribblers!</RouterLink>
  </div>
</template> -->

<style scoped>

.title-button {
  font-weight: 500;
  position: relative;
  text-decoration: none;
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
  padding: 10px;
  background-color: white;
  border-radius: 25px;
  border-style: solid;
  border-color: #000;
  border-width: 7px;
}

.icon {
  position: relative;
  width:50px; /* you can use % */
  height: auto;
}

</style>
