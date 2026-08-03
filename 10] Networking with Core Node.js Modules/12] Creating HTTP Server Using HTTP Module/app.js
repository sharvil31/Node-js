// Creating HTTP Server Using HTTP Module

import http from "node:http";

const server = http.createServer((request, response) => { // request - readable stream, response - writable stream
    console.log("Got the request");
    console.log(request.url);
    console.log(request.method);
    response.setHeader("Content-Length", "23");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.write("hello from http server.");
    console.log(request.headers);
    request.on("data", (chunk) => {    // for http data starts after headers. When there's data body after headers only then data event fires.
        console.log("Got data on request");
        console.log(chunk.toString());
    })
    // response.end();
});
// OR
// server.on("request", (request, response) => { // request - readable stream, response - writable stream
//     console.log("Got the request");
//     response.setHeader("Content-Length", "23")
//     response.write("hello from http server.");
//     // response.end();
// });

// TCP Connection
// server.on("connection", (socket) => {
//     socket.on("data", (chunk) => {
//         console.log("Got data on socket");
//         console.log(chunk.toString());
//     });
//     socket.end("HTTP\n\nHii from http server");
// });


server.listen(4000, "0.0.0.0", () => {
    console.log("Server started");
});