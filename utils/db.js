


import data from "../data/results.json" with {type: "json"}
const length = data.length

export function getRandomWord(){
    const randomIndex = Math.floor(Math.random() * length)
    return data[randomIndex]
}


export function getRandomNoun(){ //fix this
    let word;

    while(true){
        word = getRandomWord()
        if (word.genders[0] !== undefined && word.posEnglish === "Noun") {
            break;
        } 
    }

    return {
        text: word.text,
        article: word.genders[0] === "mask." ? "masc" :
        word.genders[0] === "fem." ? "fem" :
        word.genders[0] === "neutr." ? "neuter" : "plural",
        translation: word.translations
    }
}
