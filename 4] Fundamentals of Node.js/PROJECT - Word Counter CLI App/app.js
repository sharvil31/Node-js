import { readFile } from "node:fs/promises";

console.log(process.argv);

const [filePath, fileWord] = process.argv.slice(2);
// const fileWord = process.argv[3];

console.log(fileWord);

const fileContent = await readFile(filePath, "utf-8");

const wordsArray = fileContent.trim().split(/[\W]/).filter(Boolean);

const wordsCount = {};

for (const word of wordsArray) {
  if (fileWord && word !== fileWord) continue;

  wordsCount[word] = (wordsCount[word] || 0) + 1;
}

console.log(wordsCount);
