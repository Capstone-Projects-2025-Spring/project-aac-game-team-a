<template>
    <div class="aac-board">
        <!-- Overlay when disabled -->
        <div v-if="props.disabled" @click="speakNow('Wait')" class="aac-disabled">
            <p>Disabled for {{ props.timeDisabled }}</p>
        </div>

        <!-- Grid for categories. -->
        <div v-if="!currentCategory" class="grid">
            <button v-for="(items, category) in categories" :key="category" @click="setCurrentCategory(category)" class="aac-buttons">
                <img :src="getCategoryImage(category)" :alt="category" class="category-image"/>
                <p>{{category}}</p>
            </button>
        </div>

        <!-- Back button + Grid for items in a category -->
        <div v-else class="grid">
            <!-- Back button as first item in the grid -->
            <button class="aac-buttons" @click="setCurrentCategory(null)">
                <img src="/aacSymbols/back.png" alt="Back" class="item-image" />
                <p>Back</p>
            </button>

            <button v-for="item in categories[currentCategory]" :key="item" @click="selectItem(item)" class="aac-buttons">
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
// define props
const props = defineProps(['disabled', 'timeDisabled'])
// Define state of the settings
const settingsState = SettingState();

let currentCategory = ref(null);

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
    // Cancel any current TTS
    speechSynthesis.cancel();
    // Only use text-to-speech if enabled and the string does not contain 'null'
    if(settingsState.enableTTS && !textToSpeak.includes('null')){
        const utterance = new SpeechSynthesisUtterance(textToSpeak); // Synthesize the speech
        utterance.volume = settingsState.volumeTTS // Set the volume of speech
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
    currentCategory.value = category
}

</script>

<style scoped>
 .aac-board {
    position: relative; /* Make this the positioning context */
    width: 1000px;
    height: 250px;
    border: 5px solid rgb(39, 114, 254);
    border-radius: 25px;
    background-color: #e0e0e0;
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden;
}

/* For when the guesser chooses incorrectly */
.aac-disabled {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background-color: rgba(105, 105, 105, 0.6); 
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-text-stroke: 2px black;
    color: white;
    border-radius: 20px;
    z-index: 10;
    
    font-family: 'Segoe UI', sans-serif;
    font-weight: bold;
    font-size: 70px;
    pointer-events: all;
}

/* AAC buttons */
.aac-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
    background: white;
    border: 2px solid black;
    border-radius: 10px;
    padding: 5px;

    box-sizing: border-box;
    cursor: pointer;
    overflow: hidden;
}

/* Images inside buttons */
.aac-buttons img {
    max-width: 100%;
    max-height: 70%;
    object-fit: contain;
}

/* Text inside buttons */
.aac-buttons p {
    margin: 5px 0 0;
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    word-break: break-word;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; /* remove this if you want multiline text */
}

/* Grid layout */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); /* flexible column layout */
    gap: 10px;
    width: 100%;
    height: 100%;
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