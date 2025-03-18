
function setVoiceAndSpeak(utterance, voices, voiceName) {
    const selectedVoice = voices.find(voice => voice.name === voiceName);
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } else {
        console.warn(`Voice "${voiceName}" not found. Using default.`);
    }
    window.speechSynthesis.speak(utterance);
}

export function speak(text, voiceName = "Google Deutsch") {
    const synth = window.speechSynthesis;

    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    function setVoiceAndSpeak() {
        const voices = synth.getVoices();
        const selectedVoice = voices.find(voice => voice.name === voiceName);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        } else {
            console.warn(`Voice "${voiceName}" not found. Using default.`);
        }
        synth.speak(utterance);
    }

    // If voices are not loaded yet, wait for them
    if (!synth.getVoices().length) {
        synth.onvoiceschanged = () => {
            setVoiceAndSpeak();
            synth.onvoiceschanged = null; // Remove event listener after execution
        };
    } else {
        setVoiceAndSpeak();
    }
}

