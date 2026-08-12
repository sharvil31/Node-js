// Project - Creating Online Storage Platform Like Google Drive

import { open, readdir, readFile } from "fs/promises";
import http from "http";

// Implementing read functionality
const server = http.createServer(async (req, res) => {
  if (req.url === "/favicon.ico") return res.end("No favicon.");
  if (req.url === "/") {
    serveDirectory(req, res);
  } else {
    try {
      const fileHandle = await open(`./storage${decodeURIComponent(req.url)}`);
      const stats = await fileHandle.stat();

      if (stats.isDirectory()) {
        serveDirectory(req, res);
      } else {
        const readStream = fileHandle.createReadStream();
        readStream.pipe(res);
      }
    } catch (error) {
      console.log(error.message);
      res.end("Not Found!");
    }
  }
});

async function serveDirectory(req, res) {
  const itemsList = await readdir(`./storage${decodeURIComponent(req.url)}`);
  //   console.log(itemsList);
  let dynamicHTML = "";
  itemsList.forEach((item) => {
    dynamicHTML += `<a href=".${req.url === "/" ? "" : req.url}/${item}">${item}</a></br>`;
  });
  // console.log(dynamicHTML);
  const htmlBoilerplate = await readFile("./boilerPlate.html", "utf-8");
  res.end(htmlBoilerplate.replace("${dynamicHTML}", dynamicHTML));
}

server.listen(3000, "0.0.0.0", () => {
  console.log("Server Started");
});
