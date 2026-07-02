import {Buffer, constants} from "buffer";

// Condition for allocUnsafe to use Buffer Pool
// Buffer size < Buffer.poolSize >>> 2 (right shift - divide + floor) 

Buffer.poolSize = 10000;

// const a = Buffer.alloc(4);
// const z = Buffer.alloc(4);

// console.log(constants.MAX_LENGTH)
// console.log(constants.MAX_STRING_LENGTH)

// // const b = Buffer.allocUnsafe(8);
// const b = Buffer.allocUnsafe(4095);
// // const c = Buffer.allocUnsafe(4095);
// const c = Buffer.allocUnsafe(4095 - 6);
// // const c = Buffer.allocUnsafe(4);
// const d = Buffer.from("abc"); // uses allocUnsafe bts

// const joinBuffer = Buffer.concat([a, z])
// b[2] = 97;
// c[0] = 100;

// console.log(a.byteLength);
// console.log(b.byteLength);
// console.log("****************");
// console.log(a.buffer.byteLength);
// console.log(b.buffer.byteLength);
// console.log(b.buffer === c.buffer);
// console.log("end")

// console.log(Buffer.poolSize); // 8kb

const a = Buffer.allocUnsafe(4)
const b = Buffer.allocUnsafeSlow(4)

console.log(a.buffer.byteLength)
console.log(b.buffer.byteLength)