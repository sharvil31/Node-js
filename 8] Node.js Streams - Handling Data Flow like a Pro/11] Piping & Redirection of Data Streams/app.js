
// Piping and Redirection of Data Streams

// piping - connecting one process's stdout to another process's stdin.

// file - app.js

// echo "Hii" | node app.js - pipe only works in Ubuntu(Linux) terminal

process.stdin.setEncoding("utf-8")
process.stdin.on("data", (chunk) => {
    console.log("app.js: ", chunk);
})

// another file - script.js

// process.stdout.write("stdout: Hi from script.js\n")
// process.stderr.write("stderr: Hi from script.js\n")
// node script.js | node app.js

// process.stderr.write("Hi from script.js\n")
// node script.js | node app.js - pipe operator only pipes stdout 

// Redirection - transfers one file's data to another file.

// node script.js > output.txt
// node script.js 2> output.txt
// node script.js > output.txt 2> output.txt
// node script.js > output.txt 2>> output.txt
// node script.js >> output.txt 2>> output.txt

// node app.js < output.txt