// Implementing Internal Buffer in our Custom Stream


import fs from "fs";

// direct writing on disk

// console.time();

// time: 240ms
// const fd = fs.openSync("numbers.txt", "w");

// for(let i = 1; i <= 100000; i++) {
//     fs.writeSync(fd, `${i} `);
// }

// fs.closeSync(fd);

// console.timeEnd();


// With Buffer

// time: 130ms
console.time();
const fd = fs.openSync("numbers.txt", "w");

const buff = Buffer.allocUnsafe(16);

let totalBytesWrittenInBuffer = 0;
let remainingStr = "";

for (let i = 1; i <= 100000; i++) {
    let str = `${i}, `;
    str = remainingStr += str;

    const bytesWritten = buff.write(str, totalBytesWrittenInBuffer);

    remainingStr = "";

    const writtenBytesDiff = str.length - bytesWritten;

    if (writtenBytesDiff !== 0) {
        remainingStr += str.slice(bytesWritten);
    }
    totalBytesWrittenInBuffer += bytesWritten;

    if (totalBytesWrittenInBuffer === buff.byteLength) {
        fs.writeSync(fd, buff);
        totalBytesWrittenInBuffer = 0;
    }
}

fs.writeSync(fd, buff.subarray(0, totalBytesWrittenInBuffer));
fs.writeSync(fd, remainingStr);

fs.closeSync(fd);

console.timeEnd();