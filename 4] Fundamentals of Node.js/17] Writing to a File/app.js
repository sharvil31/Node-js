import { appendFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// fs.writeFile("file-1.txt", "Hello World");

// fs.appendFile("file-1.txt", "\nHello World");

// const contentBuffer = await readFile("./aot.jpg");
// console.log(contentBuffer);
// await writeFile("C:\\Users\\SHARVIL AMBURLE\\Desktop\\attackontitan.jpg", contentBuffer);

// try {
//     const contentBuffer = await readFile("apps.js");
//     writeFile("C:\\Users\\SHARVIL AMBURLE\\Desktop", contentBuffer);
// } catch (error) {
//     appendFile("error.log", `\n\n\n${new Date().toLocaleTimeString()}\n${error.message}\n${error.stack}`);
//     console.log(error);
//     console.log("To see full error message go to ./error.log file.");
// }

const [, , command, filename, copyPath] = process.argv;

if (command === "copy") {
  try {
    const imgBuffer = await readFile(filename);
    const fullPath = path.join(copyPath, path.basename(filename));
    await writeFile(fullPath, imgBuffer);
    console.log(`Copied successfully to: ${fullPath}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
