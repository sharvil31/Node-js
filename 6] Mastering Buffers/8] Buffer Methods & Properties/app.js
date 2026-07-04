import {Buffer, constants} from "buffer"

// const nodeBuffer = Buffer.from("Hello World!", "utf-16le");
// console.log(nodeBuffer.toString("utf-8"));

const nodeBuffer = Buffer.from("Hello World");

// Methods

// console.log(nodeBuffer.toString("binary"));

// const nodeBuffer2 = Buffer.alloc(8);
// nodeBuffer.write("abcdef")
// console.log(nodeBuffer.toString());
// console.log(nodeBuffer.toJSON());
// console.log(nodeBuffer.slice(5).toString());  // Depricated
// console.log(nodeBuffer.subarray(2).toString());

// nodeBuffer.copy(nodeBuffer2, 0, 0, 5);
// console.log(nodeBuffer2.toString())
// console.log(nodeBuffer.includes("He", 5, "utf-16le"));
// nodeBuffer.fill(80)

// console.log(nodeBuffer.readInt8(2));
// console.log(nodeBuffer.readInt16LE(0));
// console.log(nodeBuffer.readInt16BE(0));
// console.log(nodeBuffer2);
// console.log(nodeBuffer2.writeInt8(0x65, 2));
// console.log(nodeBuffer2)
// console.log(nodeBuffer.at(2))
// console.log(nodeBuffer.swap16())

// Properties

// console.log(nodeBuffer.buffer);
// console.log(nodeBuffer.byteLength);
// console.log(nodeBuffer.byteOffset);
// console.log(nodeBuffer.length);