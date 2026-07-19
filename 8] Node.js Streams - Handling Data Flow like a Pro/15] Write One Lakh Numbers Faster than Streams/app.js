// Write One Lakh Numbers Faster than Streams

import fs from "fs";

console.time();

// time: 240ms
const fd = fs.openSync("numbers.txt", "w");

for(let i = 1; i <= 100000; i++) {
    fs.writeSync(fd, `${i} `);
}

fs.closeSync(fd);

console.timeEnd();