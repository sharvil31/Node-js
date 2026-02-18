Difference Between CJS and MJS Module Systems

There are lot of differences between CommonJS module system and ES6 module system other than syntax difference.

// CommonJS Module System //

1. CommonJS modules are synchronous. They load synchronously. All the works like reading, writing, loading tasks are executed in main thread. 

2. File extension is optional. With a full path any file can be loaded like .mp3, .mp4, .png, .txt, etc. with require function.

3. It is a convention to add ".cjs" in file extension if both commonJS and ES6 modules are used in one project.

4. CommonJS is by default available in Node.js. It is Node.js default module system. We don't need to discretely set it in package.json. It is optional

5. In CommonJS, "this" keyword points to module.exports's by default.

6. CommonJS imports are not hoisted. They execution depends on where they are placed in program.

7. We cannot use "await" keyword at top level of our code in cjs.

8. We can only export one value from one file in cjs. It actually makes sense because require is a function and only one value can be returned from a function.

// ES6 Module System //

1. ES6 modules are asynchronous. They load asynchronously. All tasks are performed in javascript's main thread except reading files. Javascript reads files in different thread behind the scenes and after it executes in main thread. With this event loop doesn't get blocked and performance improves a bit. Our application stays responsive. 

2. File extension in mandatory. Cannot load all files. Only .js and .mjs files are allowed.

3. It is a convention to add ".mjs" in file extension if both commonJS and ES6 modules are used in one project.

4. If we want to use ES6 modules in Node.js we need to set "type: module" in project's package.json.

5. In ES6 module, "this" keyword is "undefined".

6. import statements are hoisted and always runs first before any other code in ES6 module. It doesn't matter where you are placed import statements in program.

7. We can use "await" keyword at top level of our code in mjs.

8. ES6 allows you to export multiple values from one file by named exports.