import fs from "fs";
import process from "process";

// console.log(process.stdin);
// console.log(process.stdout);
// console.log(process.stderr);

// process.stdin.write("Hii")
// process.stdout.write("Hii");

// const writeStream = fs.createWriteStream("output.txt")

// process.stdin.pipe(writeStream);

// process.stderr.write("hii");


console.log(process.stdin.fd);
console.log(process.stdout.fd);
console.log(process.stderr.fd);
