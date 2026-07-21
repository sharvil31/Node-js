console.time();
const response = await fetch("http://localhost:4000/");
// const data = await response.text();
// console.log(response);
const decoder = new TextDecoder();
for await (const chunk of response.body) { // response.body - readable stream
  console.log(decoder.decode(chunk));
}
console.timeEnd()