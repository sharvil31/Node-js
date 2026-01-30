const { Worker } = require("worker_threads");

// Creating threads
new Worker("./a");
new Worker("./b");
new Worker("./c");
