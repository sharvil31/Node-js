import express from "express";
import { createWriteStream } from "fs";
import { mkdir, readdir, rename, rm, stat } from "fs/promises";
import cors from "cors";
import path from "path";

const app = express();

app.use(express.json());
app.use(cors());

// Directory Read
app.get("/directory/*", async (req, res) => {
  // Optional Dynamic Route
  const dirname = path.join("/", req.params[0]); // Fixing Path Traversal Vulnerability with Path Module
  console.log(dirname);
  const fullDirPath = `./storage/${dirname ?? ""}`;
  try {
    const filesList = await readdir(fullDirPath);
    const resData = [];
    for (let item of filesList) {
      const stats = await stat(`${fullDirPath}/${item}`);
      resData.push({ name: item, isDirectory: stats.isDirectory() });
    }
    res.json(resData);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// Directory Create
app.post("/directory/*", async (req, res) => {
  const filePath = path.join("/", req.params[0]);
  try {
    await mkdir(`./storage/${filePath}/${req.body.newDirName}`);
    res.json({ message: "Directory Created Successfully" });
  } catch (error) {
    res.json({ message: "Directory Creation Failed!" });
  }
});

// Create
app.post("/files/*", async (req, res) => {
  const filePath = path.join("/", req.params[0]);
  const writeStream = createWriteStream(`./storage/${filePath}`);
  req.pipe(writeStream);
  req.on("end", () => {
    writeStream.end();
    res.json({ message: "File uploaded on the server" });
  });
});

// Download and open Files
app.get("/files/*", (req, res) => {
  const filePath = path.join("/", req.params[0]);
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }
  res.sendFile(`${import.meta.dirname}/storage/${filePath}`, (err) => {
    if (err) res.json({ error: "File Not Found!" });
  });
});

// Update
app.patch("/files/*", async (req, res) => {
  const filePath = path.join("/", req.params[0]);
  try {
    await rename(`./storage/${filePath}`, `./storage/${req.body.newFilename}`);
    res.json({ message: "Renamed Successfully" });
  } catch (error) {
    res.json({ message: "Rename Failed!" });
  }
});

// Delete
app.delete("/files/*", async (req, res) => {
  const filePath = path.join("/", req.params[0]);
  const fullPath = `./storage/${filePath}`;
  try {
    await rm(fullPath, { recursive: true });
    res.json({ message: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

app.listen(4000, () => {
  console.log(`Server Started`);
});
