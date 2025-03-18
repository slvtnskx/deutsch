const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const soundLinks = ['/deutsch/sounds/pop.mp3', '/deutsch/sounds/correct.mp3', '/deutsch/sounds/incorrect.mp3']
const soundBuffers = {
    pop: null,
    correct: null,
    incorrect: null
}

soundLinks.forEach(link => {
    fetch(link)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(buffer => {
        const a = link.split("/")
        const b = a[a.length - 1]
        const c = b.split(".")[0]
        soundBuffers[c] = buffer
    });
})

export function playSound(type) {
    const source = audioContext.createBufferSource();
    if (type === "click" && soundBuffers.pop){
        source.buffer = soundBuffers.pop;
    }
    else if (type === "correct" && soundBuffers.correct){
        source.buffer = soundBuffers.correct;
    }
    else if (type === "incorrect" && soundBuffers.incorrect){
        source.buffer = soundBuffers.incorrect;
    } else { return }
    
    source.connect(audioContext.destination);
    source.start();
}