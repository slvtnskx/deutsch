import { playSound } from "../utils/sounds.js"
import { getRandomNoun } from "../utils/db.js"
import { updateProgressBar } from "../utils/progressBar.js"


const labels = document.querySelectorAll('label:has(input[type="radio"])');
labels.forEach(element => {
    element.addEventListener('click', () => {playSound("click")});
})

const spelling = document.getElementById("spelling")
spelling.addEventListener("change", (event) => {
    if (event.target.checked) {
        for (const wordSpan of wordSpans) {
            wordSpan.hidden = false
        }
    } else {
        for (const wordSpan of wordSpans) {
            wordSpan.hidden = true
        }
    }
});

const form = document.getElementById("form")
const submitButton = document.querySelector(".submit-button")

const output = document.getElementById("output")
const translation = document.getElementById("translation")
const evaluation = document.getElementById("evaluation")
const nextButton = document.querySelector(".next-button")

const wordsTested = []
let correctAnswers = 0
let wrongAnswers = 0

const wordSpans = form.getElementsByClassName("input-word")
const inputs = Array.from(wordSpans).map((span) => span.parentElement.getElementsByTagName("input")[0])


const ROUNDS = 3

let word = ""
let round = 0

for (const input of inputs) {
    input.addEventListener("input", (event) => {
        submitButton.inert = false
        console.log("inside input listener")
    })
}

function nextIteration() {
    // last progress bar update should be done in a blocking way instead
    round > 0 ? updateProgressBar(100/ROUNDS) : undefined
    document.body.classList.remove("correct", "incorrect")
    if (round === ROUNDS) {
        document.body.innerHTML = `
        <a id="home-button" href="/deutsch/index.html">Home</a>
        <p>correct: ${correctAnswers}</p>
        <p>incorrect: ${wrongAnswers}</p>
        <pre>${JSON.stringify(wordsTested, null, 2)}</pre>
        `
        //location.replace("/deutsch/index.html");
    }
    
    round++
    output.close()
    word = getRandomNoun()
    wordsTested.push(word)
    translation.innerText = word.translation
    form.reset()
    form.inert = false
    submitButton.inert = true
    
    for (const wordSpan of wordSpans) {
        wordSpan.innerText = word.text
        wordSpan.parentElement.classList.remove("answer")
        if (word.article === wordSpan.parentElement.getElementsByTagName("input")[0].value) {
            wordSpan.parentElement.classList.add("answer")
        }
    }
}

nextButton.addEventListener("click", () => { nextIteration() } )

function onSubmit(correctness) {
    form.inert = true
    correctness ? correctAnswers++ : wrongAnswers++
    wordsTested[wordsTested.length - 1].correct = correctness
    evaluation.innerText = correctness ? "correct" : "incorrect"
    document.body.classList.add(correctness ? "correct" : "incorrect")
    playSound(correctness ? "correct" : "incorrect")
    output.show()
}

form.addEventListener("submit", (event) => {
    event.preventDefault()
    if (form.gender.value === word.article){
        onSubmit(true)
    } else {
        onSubmit(false)
    }
})

nextIteration()

