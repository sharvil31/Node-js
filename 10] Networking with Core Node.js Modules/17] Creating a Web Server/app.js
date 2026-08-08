// Creating a Web Server

import { createReadStream } from "fs";
import { readFile } from "fs/promises";
import http from "http";

const server = http.createServer(async (req, res) => {
    // if (req.url === "/") {
    //     const fileContent = await readFile("./index.html");
    //     res.end(fileContent);
    // } else {
    //     const fileContent = await readFile(`.${req.url}`);
    //     res.end(fileContent);
    // }

    // Using Streams
    if (req.url === "/") {
        const readStream = createReadStream("./public/index.html");
        readStream.pipe(res);
    } else {
        const readStream = createReadStream(`./public${req.url}`);

        readStream.on("error", (err) => {
            console.log(err.message);
            res.end("Not Found!");
        });
        readStream.pipe(res);
    }
});

server.listen(4000, "192.168.0.113", () => {
    console.log("Server started");
});