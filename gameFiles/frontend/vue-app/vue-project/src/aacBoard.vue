<template>
    <div class="aac-board">
        <!-- This button only appears if currentCategory is not null. -->
        <button v-if="currentCategory" @click="currentCategory = null">Back</button> 

        <div v-if="!currentCategory" class="grid">

            <button v-for="(items, category) in categories" :key="category" @click="currentCategory = category">
                {{category}}
            </button>
        </div>

        <div v-else class="grid">
            <button v-for="item in categories[currentCategory]" :key="item">
                {{item}}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const currentCategory = ref(null);

const categories = {
    Animals: ['Dog', 'Cat', 'Bird'],
    Food: ['Apple', 'Pizza', 'Carrot'],
    Clothing: ['Shirt', 'Pants', 'Hat'],
    Actions: ['Run', 'Jump', 'Eat'],
    Shapes: ['Circle', 'Square', 'Triangle']
};
</script>

<style scoped>
.aac-board {
    text-align: center;
    padding: 20px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    max-width: 300px;
    margin: auto;
}

button {
    padding: 15px;
    font-size: 16px;
    cursor: pointer;
}
</style>