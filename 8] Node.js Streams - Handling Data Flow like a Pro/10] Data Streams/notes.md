### Data Streams

A process means a running task. When we start any application means we are starting a process and when a process starts, it has 3 types of Data Streams - 

1. Standard Input Data Stream(stdin) - It is connected with a keyboard if we starts a process with terminal. It is a Duplex Stream. But in most cases stdin works as a readable stream. To use it as a Duplex Stream. we need to write some extra code.

2. Standard Output Data Stream(stdout) - It is connected to a monitor and it is also a duplex stream but where stdin works as readable stream, it works as a writable stream by default.

2. Standard Error Data Stream(stderr) - It is also connected to a monitor and it is also a duplex stream, works as a writable stream by default.

example: 

suppose we open a terminal(bash, powershell, etc.) in VS Code. Terminal is also a process started by the VS Code. If we type any command like ls, pwd, etc., then the command which will run is a input. A input is going in terminal and this input goes through stdin stream. The output that comes after is comes from stdout. stream. If an error or warning occurs, it is shown through stderr stream.

Why Learn this?

By default this streams are connected to keyboard or monitor. But they are very powerful. We can connect them with anything. We can connect one application stream with other application stream. Like one app's stdout stream to other app's stdin stream. By this, two application can communicate each other. One app does a task and result is shown on other app.

---

All the data streams are associated with a number. stdin: 0, stdout: 1 and stderr: 2. These numbers are called File Descriptor(fd). This number is assigned by OS to every file and also data streams. streams fd numbers are fixed.