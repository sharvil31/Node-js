const environmentVariables = (process.env.num2 = 500);
console.log(environmentVariables);

// debugging node.js in browser (run file with --inspect. in browser console you will see node.js icon. clicking it will open a dedicated node.js console window. clicking on file name will open source. you can attach debugger now to inspect)
setInterval(() => {
  console.log(environmentVariables);
}, 1000)


// add env from different file to process.env
const fs = require("fs");

const fileData = fs.readFileSync("./.env").toString();

fileData.split("\r\n").forEach((variable) => {
  const [key, value] = variable.split("=");
  process.env[key] = value;
});

setInterval(() => {
  const a = process.env;
  console.log(hii);
}, 1000);
//

const { exec } = require("child_process");

// creating, updating user environment variables using Node.js
exec(`powershell -command "setx VARIABLE_NAME 'abc'"`); // bash

// deleting user environment variables using Node.js
exec(
  `powershell -Command "REG delete \'HKCU\\Environment\' /F /V VARIABLE_NAME"`,
); // bash

// for bash terminal
exec(`powershell -Command "REG delete HKCU\Environment /F /V VARIABLE_NAME"`);

// creating, updating system environment variables using Node.js
exec(`powershell -Command "setx VARIABLE_NAME 'Sharvil Amburle' /M"`);
