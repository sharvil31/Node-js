// Project - Creating Online Storage Platform Like Google Drive

import { open, readdir, readFile } from "fs/promises";
import http from "http";
import mime from "mime-types";

// Implementing read functionality
const server = http.createServer(async (req, res) => {
  console.log(req.url);
  if (req.url === "/favicon.ico") return res.end("No favicon.");
  if (req.url === "/") {
    serveDirectory(req, res);
  } else {
    try {
      const [url, queryStr] = req.url.split("?");
      // console.log("hii", { url, queryStr });
      const queryParams = {};
      queryStr.split("&").forEach((pair) => {
        const [key, value] = pair.split("=");
        queryParams[key] = value;
      });
      console.log(queryParams);
      const fileHandle = await open(`./storage${decodeURIComponent(url)}`);
      const stats = await fileHandle.stat();

      if (stats.isDirectory()) {
        serveDirectory(req, res);
      } else {
        const readStream = fileHandle.createReadStream();
        const type = mime.lookup(url) || "application/octet-stream";
        res.setHeader("Content-Type", type);
        res.setHeader("Content-Length", stats.size);
        if (queryParams.action === "download") {
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${url.slice(1)}"`,
          );
        }
        readStream.pipe(res);
      }
    } catch (error) {
      console.log(error.message);
      res.end("Not Found!");
    }
  }
});

async function serveDirectory(req, res) {
  const [dirPath] = req.url.split("?");
  const basePath = `./storage${decodeURIComponent(dirPath)}`;
  const itemsList = await readdir(basePath, { withFileTypes: true });

  let dynamicHTML = "";
  for (const item of itemsList) {
    const itemPath = `.${dirPath === "/" ? "" : dirPath}/${item.name}`;
    dynamicHTML += `${item.name} <a href="${itemPath}?action=open">Open</a>`;
    if (!item.isDirectory()) {
      dynamicHTML += ` <a href="${itemPath}?action=download">Download</a>`;
    }
    dynamicHTML += `</br>`;
  }

  const htmlBoilerplate = await readFile("./boilerPlate.html", "utf-8");
  res.end(htmlBoilerplate.replace("${dynamicHTML}", dynamicHTML));
}

server.listen(3000, "0.0.0.0", () => {
  console.log("Server Started");
});
