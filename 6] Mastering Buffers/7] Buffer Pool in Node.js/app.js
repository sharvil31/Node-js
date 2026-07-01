import {Buffer} from "buffer";

// Condition for allocUnsafe to use Buffer Pool
// Buffer size < Buffer.poolSize >>> 2 (right shift - divide + floor) 

const a = Buffer.alloc(4);
// const b = Buffer.allocUnsafe(8);
const b = Buffer.allocUnsafe(4095);
const c = Buffer.allocUnsafe(4);

b[2] = 97;
c[0] = 100;

// console.log(a.byteLength);
// console.log(b.byteLength);
// console.log("****************");
// console.log(a.buffer.byteLength);
// console.log(b.buffer.byteLength);
console.log(b.buffer === c.buffer);
console.log("end")

// console.log(Buffer.poolSize); // 8kb