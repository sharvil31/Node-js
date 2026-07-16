// Why Streams are so Fast?

import fs, { createWriteStream } from "fs";

// console.time();
// for (let i = 1; i <= 100000; i++) {
//     fs.appendFileSync("numbers.txt", `${i} `)
// }

// console.timeEnd();
// time: 23s

// with Streams

console.time();

const writeStream = createWriteStream("streamNumbers.txt")

for (let i = 1; i <= 100000; i++) {
    writeStream.write(`${i} `)
}

writeStream.end();

writeStream.on("finish", () => {
    console.timeEnd();
});

// time: 400ms

// Why Streams are so Fast?

//1] In first example we are using appendFileSync. Whenever we write in a file using appendFileSync, appendFile, writeFileSync, writeFile, this methods searches file in file system, opens it, write content and then closes it. They keep doing this until all content is written. In first example appendFileSync search, open write, close file for every number until number goes above 1000000. It is very inefficient.

// Bur in streams file opens only once when we call createWriteStream method. The .write method dont open file again and again. Instead it writes in internal Buufer not in file itself unlike above four methods who writes on disk repeatedly. It closes file only after .end method call.

// 2] Streams carry big data at once. where above four methods directly writes to Disk whereas Streams has its own internal Buffer and it writes in that buffer. Writing in a buffer is comparatively very fast because writing in a buffer is like writing in a RAM, and RAM is much faster than Disk. When it writes upto 16kb data in RAM, then it writes that 16kb data in Disk.