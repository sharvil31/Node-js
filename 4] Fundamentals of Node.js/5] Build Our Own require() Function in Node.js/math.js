// module.exports = 56;

// console.log(__dirname);
// console.log(__filename);

// console.log(send);
// console.log("Hii, running math.js");

const { sum } = loadModule("./sum.js"); // destructure from send obj

console.log(sum(4, 3, 2, 1, 1));

send.a = 5;