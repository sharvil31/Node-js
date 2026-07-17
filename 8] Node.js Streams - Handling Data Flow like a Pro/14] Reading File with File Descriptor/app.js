import fs from "fs";

const fd = fs.openSync("text.txt");

const readBuffer = Buffer.alloc(10) // optional

fs.read(fd, { buffer: readBuffer, length: 5, position: 2, offset: 2 }, (err, bytesRead, buffData) => {
    console.log(err);
    console.log(bytesRead);
    console.log(buffData);
    console.log(buffData.byteLength);
    console.log(buffData.toString());
});