<script setup>
    import { onMounted } from 'vue'
    import { SettingState } from '@/stores/SettingState'

    //define the emit function to send events to parent
    const emit = defineEmits(['playAgain']);

    // Define state of the settings
    const settingsState = SettingState();

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

    function playAgain() {
        speakNow('Play again')
        emit("playAgain");
    }

</script>

<template>
    <div class="end-screen">
        <button @click="playAgain">Back to Lobby</button>
    </div>
</template>

<style>
    .end-screen{
        max-width: 600px;
        margin: 80px auto;
        padding: 40px;
        background-color: #ffffff;
        border-radius: 20px;
        border-style: solid;
        border-color: black;
        border-width: 3px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        text-align: center;
        font-family: 'Segoe UI', sans-serif;
    }
</style>