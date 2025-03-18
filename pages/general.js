
import { playSound } from "../utils/sounds.js"
import { getRandomNoun } from "../utils/db.js"
import { updateProgressBar } from "../utils/progressBar.js"

const output = document.getElementById("output")

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
const translation = document.getElementById("translation")
const evaluation = document.getElementById("evaluation")
const nextButton = document.querySelector(".next-button")
const submitButton = document.querySelector(".submit-button")

const wordsTested = []
let correctAnswers = 0
let wrongAnswers = 0


//----------------------------------------------------------------




const ROUNDS = 10
document.getElementById("progress").max = ROUNDS * 10
    //fix bug where progress runs out of space before the end of the session



const wordSpans = form.getElementsByClassName("input-word")









function loop(iteration = 0) {
    if (iteration !== 0){
        updateProgressBar()
        //theres gotta be a better way to do this
    }
    
    if (iteration > ROUNDS) {
        localStorage.setItem("correctAnswers", correctAnswers)
        localStorage.setItem("wrongAnswers", wrongAnswers)
        localStorage.setItem("wordsTested", JSON.stringify(wordsTested))
        location.replace("/deutsch/index.html");
    }

    document.body.classList.remove("correct", "incorrect")
    form.inert = false
    output.close()

    

    const word = getRandomNoun()
    const currentWord = {word: word.text, correct: undefined}

    for (const wordSpan of wordSpans) {
        wordSpan.innerText = word.text

        wordSpan.parentElement.classList.remove("answer")
        if (word.article === wordSpan.parentElement.getElementsByTagName("input")[0].value){
            wordSpan.parentElement.classList.add("answer")
        }
    }


    submitButton.disabled = true

    form.addEventListener("input", () => submitButton.disabled = false) //fix the accumulation of listeners

    form.addEventListener("submit", function x(event) {
        console.log("submit event run")
        event.preventDefault()
        if (form.gender.value !== "") {
        
        if (word.article === form.gender.value) {
            playSound("correct")
            correctAnswers++
            currentWord.correct = true
            wordsTested.push(currentWord)
            document.body.classList.add("correct")
            onSubmit(iteration, x)
        } else {
            playSound("incorrect") 
            wrongAnswers++
            currentWord.correct = false
            wordsTested.push(currentWord)
            document.body.classList.add("incorrect")
            onSubmit(iteration, x)
        }
        }
    })            
}




function onSubmit(iteration, x){
    //submitButton.disabled = true
    form.inert = true
    evaluation.innerText = "correct or not"
    translation.innerText = "correct: 456"
    output.show()

    nextButton.addEventListener("click", () => {
        form.reset()
        form.removeEventListener("submit", x)
        loop(iteration + 1)
    })


}

loop()

