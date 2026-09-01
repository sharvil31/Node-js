import express from "express";
import { createWriteStream } from "fs";
import { readdir, rename, rm, stat } from "fs/promises";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// Directory Read
app.get("/directory/*", async (req, res) => {
  // Optional Dynamic Route
  const { 0: dirname } = req.params;
  const fullDirPath = `./storage/${dirname ?? ""}`;
  const filesList = await readdir(fullDirPath);
  const resData = [];
  for (let item of filesList) {
    const stats = await stat(`${fullDirPath}/${item}`);
    resData.push({ name: item, isDirectory: stats.isDirectory() });
  }
  res.json(resData);
});

// Create
app.post("/files/*", async (req, res) => {
  const { 0: filePath } = req.params;
  const writeStream = createWriteStream(`./storage/${filePath}`);
  req.pipe(writeStream);
  req.on("end", () => {
    writeStream.end();
    res.json({ message: "File uploaded on the server" });
  });
});

// Download and open Files
app.get("/files/*", (req, res) => {
  const { 0: filePath } = req.params;
  console.log(req.params);
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }
  res.sendFile(`${import.meta.dirname}/storage/${filePath}`);
});

// Update
app.patch("/files/*", async (req, res) => {
  const { 0: filePath } = req.params;
  try {
    await rename(`./storage/${filePath}`, `./storage/${req.body.newFilename}`);
    res.json({ message: "Renamed Successfully" });
  } catch (error) {
    res.json({ message: "Rename Failed!" });
  }
});

// Delete
app.delete("/files/*", async (req, res) => {
  const { 0: filePath } = req.params;
  const path = `./storage/${filePath}`;
  try {
    await rm(path, { recursive: true });
    res.json({ message: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

app.listen(4000, () => {
  console.log(`Server Started`);
});
