import {readFile} from "node:fs/promises";

const fileContent = await readFile("./file-1.txt", "utf-8");

const wordsArray = fileContent.trim().split(/[\W]/).filter(Boolean);

console.log(wordsArray);

const wordsCount = {};

wordsArray.forEach((word) => {
  if (word in wordsCount) wordsCount[word] += 1;
  else wordsCount[word] = 1;
});

console.log(counter);