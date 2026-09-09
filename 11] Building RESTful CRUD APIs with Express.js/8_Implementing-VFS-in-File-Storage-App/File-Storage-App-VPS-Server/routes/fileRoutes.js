import express from "express";
import { createWriteStream } from "fs";
import { rename, rm, writeFile } from "fs/promises";
import path from "path";
import filesData from "../filesDB.json" with { type: "json" };

const router = express.Router();

// Create
router.post("/:filename", async (req, res) => {
  const { filename } = req.params;
  const fileId = crypto.randomUUID();
  const extension = path.extname(filename);
  const fullFileName = `${fileId}${extension}`;
  const writeStream = createWriteStream(`./storage/${fullFileName}`);
  req.pipe(writeStream);
  req.on("end", async () => {
    filesData.push({
      id: fileId,
      extension,
      name: filename,
    });
    console.log(filesData);
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    writeStream.end();
    res.json({ message: "File uploaded on the server" });
  });
});

// Read
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const fileData = filesData.find((file) => file.id === id);
  console.log(fileData);
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }
  res.sendFile(`${process.cwd()}/storage/${id}${fileData.extension}`, (err) => {
    if (err) res.json({ error: "File Not Found!" });
  });
});

// Update
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { newFilename } = req.body;
  const fileData = filesData.find((file) => file.id === id);
  fileData.name = newFilename;
  try {
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    res.json({ message: "Renamed Successfully" });
  } catch (error) {
    res.json({ message: "Rename Failed!" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const fileIndex = filesData.findIndex((file) => file.id === id);
  const fileData = filesData[fileIndex];
  const fullPath = `./storage/${id}${fileData.extension}`;
  try {
    await rm(fullPath, { recursive: true });
    filesData.splice(fileIndex, 1);
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    res.json({ message: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

export default router;
