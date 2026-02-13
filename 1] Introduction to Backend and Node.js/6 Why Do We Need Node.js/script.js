const { exec } = require("child_process");
const fs = require("fs");

// read system file
const text = fs.readFileSync("C:\\Users\\SHARVIL AMBURLE\\Desktop\\text.txt");
console.log(text.toString());
console.log("end");

// write system file
fs.writeFileSync("C:\\Users\\SHARVIL AMBURLE\\Desktop\\text.txt", "Your Content is Here");

// rename system file
fs.renameSync("C:\\Users\\SHARVIL AMBURLE\\Desktop\\text.txt", "C:\\Users\\SHARVIL AMBURLE\\Desktop\\hello.txt");

// delete system file
fs.unlinkSync("C:\\Users\\SHARVIL AMBURLE\\Desktop\\hello.txt");

// start an application
exec("start chrome")