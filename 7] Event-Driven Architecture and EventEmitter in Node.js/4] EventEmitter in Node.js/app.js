import EventEmitter from "events";

// console.log(EventEmitter);

const emitter = new EventEmitter();

emitter.setMaxListeners(2);

emitter.on("y", () => {
  console.log("first y event fired.");
});

emitter.on("x", () => {
  console.log("x event fired.");
});

emitter.on("y", () => {
  console.log("second y event fired.");
});

// emitter.on("y", () => {
//     console.log("third y event fired.");
// });

emitter.once("abc", () => {
  console.log("abc event fired.");
});

// console.log(emitter);
// emitter.emit("y")
// emitter.emit("x");
// emitter.emit("x");
// emitter.emit("x");

console.log(emitter._events);
emitter.emit("abc");
emitter.emit("abc");
console.log(emitter._events);

emitter.emit("adhf");
