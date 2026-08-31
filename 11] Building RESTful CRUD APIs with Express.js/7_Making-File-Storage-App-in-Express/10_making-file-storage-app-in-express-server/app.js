import express from "express";
import { createWriteStream } from "fs";
import { readdir, rename, rm, stat } from "fs/promises";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// Directory Read
app.get("/directory/:dirname?", async (req, res) => {
  // Optional Dynamic Route
  const { dirname } = req.params;
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
app.post("/files/:filename", async (req, res) => {
  const { filename } = req.params;
  const writeStream = createWriteStream(`./storage/${filename}`);
  req.pipe(writeStream);
  req.on("end", () => {
    writeStream.end();
    res.json({ message: "File uploaded on the server" });
  });
});

// Download Files
app.get("/files/:filename", (req, res) => {
  const { filename } = req.params;
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }
  res.sendFile(`${import.meta.dirname}/storage/${filename}`);
});

// Update
app.patch("/files/:filename", async (req, res) => {
  const { filename } = req.params;
  try {
    await rename(`./storage/${filename}`, `./storage/${req.body.newFilename}`);
    res.json({ message: "Renamed Successfully" });
  } catch (error) {
    res.json({ message: "Rename Failed!" });
  }
});

// Delete
app.delete("/files/:filename", async (req, res) => {
  const { filename } = req.params;
  const filePath = `./storage/${filename}`;
  try {
    await rm(filePath);
    res.json({ message: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ message: "File Not Found!" });
  }
});

app.listen(4000, () => {
  console.log(`Server Started`);
});
