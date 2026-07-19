// Reading & writing to a File with File Descriptor

import fs from "fs";

// Reading file
// const fd = fs.openSync("text.txt");

// const readBuffer = Buffer.alloc(10) // optional

// fs.read(fd, { buffer: readBuffer, length: 5, position: 2, offset: 2 }, (err, bytesRead, buffData) => {
//     console.log(err);
//     console.log(bytesRead);
//     console.log(buffData);
//     console.log(buffData.byteLength);
//     console.log(buffData.toString());
// });

// Opening Files in Different Modes

// const fd = fs.openSync("text.txt") // by default file is open in read mode
// fs.writeSync(fd, "Hii") // gives error, fd is created to read file, but we are writing on it.

// flags
// const fd = fs.openSync("text.txt", "w"); // "w" flag tells method to open and create fd for write file. By default "r"
// const fd = fs.openSync("text.txt", "a"); // for append
// const fd = fs.openSync("text.txt", "w+"); // for read and write both. creates file if doesn't exists.
// const fd = fs.openSync("text.txt", "r+"); // for read and write both. gives error if file doesn't exists.
// const fd = fs.openSync("text.txt", "a+"); // for read and write both. creates file if doesn't exists. appends to the exisiting file content.
// fs.writeSync(fd, "Hii");

// Writing file
// const fd = fs.openSync("text.txt", "w");

// fs.write(fd, "abc", (err, bytesWritten, writtenData) => {
//     console.log(bytesWritten);
//     console.log(writtenData);
// });

// we can also pass buffer
// const buff = Buffer.from("123"); // replace "abc" with buff

// const bytesWritten = fs.writeSync(fd, "abc");
// console.log(bytesWritten);