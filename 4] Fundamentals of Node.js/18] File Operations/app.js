import { rename, copyFile, cp, unlink, rmdir, rm, writeFile, mkdir, stat, watch } from "node:fs/promises";

// rename a file
// rename("aot.jpg", "aot1.jpg");

// copy a file
// copyFile("aot1.jpg", "aot.jpg");

// copy a directory/folder
// cp("./src", "C:\\Users\\SHARVIL AMBURLE\\Desktop\\src", { recursive: true });

// move a file
// rename("./aot.jpg", "C:\\Users\\SHARVIL AMBURLE\\Desktop\\aot.jpg");

// delete a file permanantly
// unlink("./aot1.jpg");

// delete a empty directory permanantly
// rmdir("./test");

// delete a non empty directory permanantly
// rm("./src", { recursive: true });

// create a file
// writeFile("test.txt", "");

// create a directory
// mkdir("src");

// gives file information
// const stats = await stat("C:\\Users\\SHARVIL AMBURLE\\Documents\\node-js\\4] Fundamentals of Node.js\\18] File Operations\\app.js");

// console.log(stats);

// watches a file
watch("test.txt", (eventType) => {
    console.log(eventType);
});