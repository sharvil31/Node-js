const a = new ArrayBuffer(1.99 * 1024 * 1024 * 1024);
const view = new DataView(a);
const view2 = new DataView(a);

// view.setInt8(0, 80);
// view.setInt8(1, 0b1010000);
// view.setInt8(2, 0x50);
// view.setInt8(3, 0o120);

for(let i = 0; i < view.byteLength; i++) {
    view.setInt8(i, i + 1);
    view2.setInt8(i, i + 1);
}

console.log(a);
console.log("End");

setInterval(() => {
    console.log("Running");
}, 2000)