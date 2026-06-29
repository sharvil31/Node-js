import {Buffer} from "buffer"

// const uint8Array = new Uint8Array(4);
const a = new ArrayBuffer(4);
// const nodeBuffer = new Buffer(4);
// const nodeBuffer = Buffer.alloc(4);
const nodeBuffer = Buffer.from(a);

console.log(nodeBuffer.buffer)