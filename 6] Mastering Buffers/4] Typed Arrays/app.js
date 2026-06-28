// const a = new ArrayBuffer(4);

// const uint8Array = new Uint8Array(a);
// const uint16Array = new Uint16Array(a);
// const uint32Array = new Uint32Array(a);

// console.log(uint8Array);
// console.log(uint16Array);
// console.log(uint32Array);

// uint8Array[2] = 0xf3
// uint16Array[0] = 0x34ea

const uint8Array = new Uint8Array([0xfe, 0xee, 0, 0x8a]);

// console.log(uint8Array.buffer);


const a = new ArrayBuffer(4, {maxByteLength: 16}); // resizable true
// a.resize(8); // a = ArrayBuffer(8)

const b = a.transfer() // detached = true

console.log(b);