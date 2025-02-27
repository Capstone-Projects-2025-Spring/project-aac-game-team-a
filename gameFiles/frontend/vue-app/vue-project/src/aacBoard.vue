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
    Animals: ['Dog', 'Cat', 'Bird', 'Elephant', 'Mouse', 'Horse'],
    Food: ['Apple', 'Pizza', 'Carrot', 'Spaghetti', 'Banana', 'Grapes'],
    Clothing: ['Shirt', 'Pants', 'Hat', 'Glasses', 'Shoe', 'Glove'],
    Actions: ['Run', 'Jump', 'Eat', 'Sleep'],
    Shapes: ['Circle', 'Square', 'Triangle']
};
</script>

<style scoped>
.aac-board {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 20px;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    max-width: 1000px;
    margin: auto;
}

button {
    padding: 30px;
    font-size: 70px;
    cursor: pointer;
    border-radius: 10px;
}
</style>