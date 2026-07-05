import fs from "fs/promises";

// fs.writeFile("text.txt", "YWJj", "base64");

// const bufferContent = await fs.readFile("favicon/favicon-16x16.png");
// const a = bufferContent.toString("base64");
// fs.writeFile("text.txt", a)

// const bufferContent = await fs.readFile("text.txt");
// const a = bufferContent.toString();
// fs.writeFile("a.png", a, "base64")


const bufferContent = await fs.readFile("script.js");
const a = bufferContent.toString("base64");
fs.writeFile("script.txt", a)
