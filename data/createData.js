
/*
import words from "./goathe-words.json" with {type: "json"}


import definitions from "./results.json" with {type: "json"}

const wordMap = new Map()
definitions.words.forEach(word => {
    wordMap.set(word.word, word.de)
})

let found = 0
let notFound = 0

words.forEach((word) => {
    const result = wordMap.get(word.text)
    if (result) {
        found++
    } else {
        console.log(word.text)
    }
})
*/

//---------------------------------------------------

import data from "./goathe-words.json" with {type: "json"}

import { writeFileSync } from "fs";
import { get } from "https";
import pLimit from "p-limit";

import * as cheerio from "cheerio"

const baseURL = "https://en.wiktionary.org/api/rest_v1/page/definition/";

const words = new Set();
const noLinkWords = new Set();

async function getData(url) {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      const { statusCode } = res;
      const contentType = res.headers["content-type"];

      if (statusCode !== 200) {
        res.resume();
        return reject(new Error(`Request Failed. Status Code: ${statusCode}`));
      }
      if (!/^application\/json/.test(contentType)) {
        res.resume();
        return reject(
          new Error(
            `Invalid content-type. Expected application/json but received ${contentType}`
          )
        );
      }

      res.setEncoding("utf8");
      let rawData = "";
      res.on("data", (chunk) => (rawData += chunk));
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData);
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", (e) => reject(e));
  });
}

let concurrencyLimit = 50;
const limit = pLimit(concurrencyLimit);

async function processWords() {
  const tasks = data.map((word) =>
    limit(async () => {
      const link = word.text
      if (link.startsWith("index.php")) {
        noLinkWords.add(word.text);
      } else {
        const url = baseURL + link;
        try {
          const responseData = await getData(url, word);
          if (responseData.de) {
            const result = {
              text: word.text,
              translations: cheerio.load(responseData?.de[0]?.definitions[0]?.definition)?.text()?.trim(),
              posGerman: word.posGerman,
              posEnglish: responseData?.de[0]?.partOfSpeech,
              genders: word.genders,
              //de: responseData.de,              
            }
            words.add(result);
          } else {
            noLinkWords.add(word.text);
          }
        } catch (e) {
          console.error(`Error fetching ${url}: ${e.message}`);
        }
      }
    })
  );

  await Promise.all(tasks);
}

processWords().then(() => {
  console.log("Processing complete.");
  console.log(`Words: ${words.size}, No Link Words: ${noLinkWords.size}`);

  console.log("noLinkWords: ", noLinkWords)

  const results = Array.from(words)
  
  writeFileSync("results.json", JSON.stringify(results, null, 2));
  console.log("Results written to results.json");
});


