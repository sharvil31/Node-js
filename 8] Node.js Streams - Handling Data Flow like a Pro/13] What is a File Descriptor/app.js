import fs from "fs";

// console.log(process.stdin.fd); // 0
// console.log(process.stdout.fd); // 1
// console.log(process.stderr.fd); // 2

// callback version
// fs.open("text.txt", (err, fd) => {
//     console.log(fd); // 3
// });

// fs.open("num.txt", (err, fd) => {
//     console.log(fd); // 4
// });

// Sync version
const fd1 = fs.openSync("text.txt");
const fd2 = fs.openSync("num.txt");

console.log({ fd1, fd2 });