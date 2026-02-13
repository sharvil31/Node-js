const { Worker } = require("worker_threads");

// Creating threads - Multithreading in Node.js
new Worker("./a");
new Worker("./b");
new Worker("./c");
