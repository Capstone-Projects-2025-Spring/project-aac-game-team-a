<template>
    <div class="aac-board">
        <!-- Grid for categories. -->
        <div v-if="!currentCategory" class="grid">
            <button v-for="(items, category) in categories" :key="category" @click="setCurrentCategory(category)">
                <img :src="getCategoryImage(category)" :alt="category" class="category-image"/>
                <p>{{category}}</p>
            </button>
        </div>

        <!-- Back button + Grid for items in a category -->
        <div v-else class="grid">
            <!-- Back button as first item in the grid -->
            <button class="back-button-grid" @click="setCurrentCategory(null)">
                <img src="/aacSymbols/back.png" alt="Back" class="item-image" />
                <p>Back</p>
            </button>

            <button v-for="item in categories[currentCategory]" :key="item" @click="selectItem(item)">
                <img :src="getItemImage(currentCategory, item)" :alt="item" class="item-image"/>
                <p>{{item}}</p>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { SettingState } from '@/stores/SettingState'

//define the emit function to send events to paren
const emit = defineEmits();
// Define local state of the settings
const settingsState = SettingState();

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
    //return new URL(`/aacSymbols/Categories/${category.toLowerCase()}.png`, import.meta.url).href;
    return `/aacSymbols/Categories/${category.toLowerCase()}.png`;
};

//Function to get item images for each category
const getItemImage = (category, item) => {
    //return new URL(`/aacSymbols/${category}/${item.toLowerCase()}.png`, import.meta.url).href;
    return `/aacSymbols/${category}/${item.toLowerCase()}.png`;
};

//Function that emits an event from this component when user selects a word
const selectItem = (item) => {
    // TTS the item
    speakNow(item)
    //Emit an event with the selected aac word and path to image
    const imagePath = getItemImage(currentCategory.value, item);
    emit('itemSelected', {item, imagePath});
};

// Called to turn text into speech
function speakNow(textToSpeak) {
  // Only use text-to-speech if enabled and the string does not contain 'null'
  if(settingsState.enableTTS && !textToSpeak.includes('null')){
    const utterance = new SpeechSynthesisUtterance(textToSpeak); // Synthesize the speech
    utterance.lang = 'en'; // Specify the language
    speechSynthesis.speak(utterance); // Speak fido
  }
}

// Defines the current category in the AAC board
function setCurrentCategory(category){
    if(category != null){
        speakNow(category)
    } else {
        speakNow('back')
    }
    this.currentCategory = category
}

</script>

<style scoped>
.aac-board {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 10px;
    justify-content: left;
    align-items: center;
    min-height: 10vh;
}

.grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 20px;
    max-width: 1000px;
    
    margin: auto;
}

button {
    padding: 0px;
    font-size: 30px;
    cursor: pointer;
    border-radius: 10px;
}

.category-image, .item-image {
    width: 100px;
    height: 70px;
    margin-bottom: 0px;
}

</style>