Difference Between CJS and MJS Module Systems

There are lot of differences between CommonJS module system and ES6 module system other than syntax difference.

// CommonJS Module System //

CommonJS modules are synchronous. They load synchronously. All the works like reading, writing, loading tasks are executed in main thread.

// ES6 Module System //

ES6 modules are asynchronous. They load asynchronously. All tasks are performed in javascript's main thread except reading files. Javascript reads files in different thread behind the scenes and after it executes in main thread. 