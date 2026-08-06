import http from "http";

const clientRequest = http.request({
  method: "POST",
  hostname: "192.168.0.113",
  port: 4000,
  // path: "/file.txt",
}); // default method is GET

clientRequest.end("Hii I am client");

clientRequest.on("response", (response) => { // response - readable
  response.on("data", (chunk) => {
    console.log(chunk.toString());
  });
});
