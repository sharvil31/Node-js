import express from "express";
import { readdir } from "fs/promises";

const app = express();

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

app.use((req, res, next) => {
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }
  const serveStatic = express.static("storage");
  serveStatic(req, res, next);
}); // same as app.use(express.static("storage"))

app.get("/", async (req, res) => {
  const filesList = await readdir("./storage");
  res.json(filesList);
});

app.listen(4000, () => {
  console.log(`Server Started`);
});
