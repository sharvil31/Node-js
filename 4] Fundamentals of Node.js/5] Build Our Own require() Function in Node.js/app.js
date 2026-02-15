const b = loadModule("./math.js");

// console.log(b);

function loadModule(path) {
  // Reading file
  const fs = require("fs");
  const vm = require("vm");
  const fileContent = fs.readFileSync(path).toString();
  //   console.log(fileContent);

  // Wrapping in Module Wrapper function
  return (function (send) {
    // eval(fileContent);
    // Node.js dont use eval it uses vm object
    // vm.runInThisContext("console.log(num)"); // this code will give error cause vm.runInThisContext runs code in global scope and num is a function scope. num is not in a global scope. To run this:
    vm.runInNewContext(fileContent, { send, loadModule, console });
    return send;
  })({});
}
