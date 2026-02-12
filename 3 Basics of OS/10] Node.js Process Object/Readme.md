Node.js Process Object

### Accessing Process Properties

## Command-line arguments
- process.argv; - gives array of paths one is node.js path and second one is file path, if you are running a file.

## Environment variables
process.env; - prints all environment variables in key value pair available in system.

// Current process ID
process.pid; - prints currently running process/app's process id.

// Parent process ID
process.ppid; - prints currently running process/app's parent process id.

// Operating system platform
process.platform; - Tells on which platform current process is running ex. win32, win64 etc.

// Node.js version
process.version; - Tells installed Node.js version.

// Node.js and dependencies versions
process.versions;

// Processor architecture
process.arch;

// Using Process Methods
// Current working directory
process.cwd();

// Change working directory
process.chdir("/tmp");

// Memory usage
process.memoryUsage();

// Process uptime
process.uptime();

// Exiting the process
// process.exit(0);

// Kill the process
process.kill(process.pid);

// Emit warning
process.emitWarning("This is a custom warning message!", {
  code: "MY_WARNING_CODE",
  detail: "This is some additional warning detail.",
});

// Interacting with stdin, stdout, and stderr streams
process.stdout.write("Hello, stdout!\n");
process.stderr.write("Hello, stderr!\n");

// Next Tick demonstration
process.nextTick(() => {
  // This will run on the next tick of the event loop.
});

// Registering event listeners
process.on("exit", (code) => {
  // Process is about to exit with code
});

process.on("warning", (warning) => {
  // Handle warning
});

process.stdin.on("data", (data) => {
  // Process input data
});
