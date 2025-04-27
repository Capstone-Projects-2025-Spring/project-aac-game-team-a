/**
 * Handles Text-to-Speech requests 
 */

class SpeechHelper {

    // Called to turn text into speech
    speakNow(textToSpeak, settingsState) {
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
}

export default SpeechHelper