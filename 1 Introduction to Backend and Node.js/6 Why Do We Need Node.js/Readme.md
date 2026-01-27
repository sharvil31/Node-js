Why Do We Need Node.js?

Node.js extends the capabilities of JavaScript beyond what is possible when running JavaScript solely in a browser environment. Here's Node.js can do that normal JavaScript cannot.

Access to File System

- In a browser JavaScript is sandboxed for security reasons, meaning it cannot directly access the file system of the client device

- Node.js provides APIs to interact with the file system, allowing you to read, write, delete and manipulate files and directories on the server.

Networking Capabilities

- In a browser, normal JavaScript can make HTTP request, but it cannot create servers or handle low-level networking tasks.

- Node.js enables the creation of web servers, handles network requests and supports low-level networking features like creating TCP/UDP servers, handling sockets, etc.

Process Management

- In a browser, normal JavaScript is limited to running on a single thread and cannot spawn processes or directly interact with the operating system.

- Node.js can spawn child processes, manage multiple threads, and handle system-level tasks like interacting with operating system processes. 