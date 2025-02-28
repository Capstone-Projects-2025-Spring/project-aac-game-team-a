<template>
    <div class="aac-board">
        <button v-if="currentCategory" @click="currentCategory = null">Back</button> 

        <!-- Grid for categories. -->
        <div v-if="!currentCategory" class="grid">

            <button v-for="(items, category) in categories" :key="category" @click="currentCategory = category">
                <!-- image display for category -->
                <img :src="getCategoryImage(category)" :alt="category" class="category-image"/>
                <p>{{category}}</p>
            </button>
        </div>

        <!-- Grid for items in a category. -->
        <div v-else class="grid">
            <button v-for="item in categories[currentCategory]" :key="item">
                <img :src="getItemImage(currentCategory, item)" :alt="item" class="item-image"/>
                <p>{{item}}</p>
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
    Shapes: ['Circle', 'Square', 'Triangle', 'Oval']
};

//List of categories for photos
const categoryList = Object.keys(categories);

//Function that gets url for category images
const getCategoryImage = (category) => {
    //return new URL(`./assets/aacSymbols/Categories/${category.toLowerCase()}.png`, import.meta.url).href;
    return `/aacSymbols/Categories/${category.toLowerCase()}.png`;
};

//Function to get item images for each category
const getItemImage = (category, item) => {
    //return new URL(`./assets/aacSymbols/${category}/${item.toLowerCase()}.png`, import.meta.url).href;
    return `/aacSymbols/${category}/${item.toLowerCase()}.png`;
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
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    max-width: 1000px;
    margin: auto;
}

button {
    padding: 10px;
    font-size: 50px;
    cursor: pointer;
    border-radius: 10px;
}

.category-image, .item-image {
    width: 200px;
    height: 200px;
    margin-bottom: 5px;
}
</style>