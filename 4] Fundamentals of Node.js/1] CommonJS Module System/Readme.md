CommonJS Module System in Node.js

require function

e.g.

```javascript
const product = require("./product");
```
Require is a function in Node.js. Require finds the file from path passed in it, loads the content in it and runs the file. Since require is a function it returns something. It returns module.exports.
