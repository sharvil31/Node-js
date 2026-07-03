import {Buffer, constants} from "buffer"

// const nodeBuffer = Buffer.from("Hello World!", "utf-16le");
// console.log(nodeBuffer.toString("utf-8"));

// const nodeBuffer = Buffer.from("abc");
// console.log(nodeBuffer.toString("binary"));

const nodeBuffer = Buffer.alloc(8);
nodeBuffer.write("abc")
console.log(nodeBuffer.toString());
console.log(nodeBuffer.toJSON());