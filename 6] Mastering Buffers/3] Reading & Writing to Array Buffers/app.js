const a = new ArrayBuffer(4);
const view = new DataView(a);

// view.setInt8(0, 80);
// view.setInt8(1, 0b1010000);
// view.setInt8(2, 0x50);
// view.setInt8(3, 0o120);

// view.setInt8(0, -1);
// view.setInt8(1, 127);
// view.setInt8(2, 128);
// view.setInt8(3, 135);
// view.setUint8(4, 223525);
// view.setUint8(5, -223525);

// // getInt8 reads value as signed
// console.log(view.getInt8(0)); // -1
// console.log(view.getInt8(1)); // 127
// console.log(view.getInt8(2)); // -128
// console.log(view.getInt8(3)); // -121
// console.log(view.getInt8(4)); // 37
// console.log(view.getInt8(5)); // -37

// // getUint8 reads value as unsigned
// console.log(view.getUint8(0)); // 255
// console.log(view.getUint8(1)); // 127
// console.log(view.getUint8(2)); // 128
// console.log(view.getUint8(3)); // 135
// console.log(view.getUint8(4)); // 37
// console.log(view.getUint8(5)); // 219


// view.setInt8(0, 260)
// view.setInt16(0, 260)
// view.setInt16(2, 260, true)

// console.log(a);

view.setInt32(0, 0x7823e324)
view.setInt32(0, 0x7823e324, true)

console.log(a);
console.log(view.getInt32(0));