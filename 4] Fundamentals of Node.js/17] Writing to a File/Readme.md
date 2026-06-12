### Writing to a File in Node.js

1. fs.writeFile() - If file exists, it replaces the content in that file with the passed content. If file doesn't exist, it creates the file and writes into it.
2. fs.appendFile() - It also writes the file. But it don't replaces the existing content. It appends to it. It also creates new file if file doesn't exist.