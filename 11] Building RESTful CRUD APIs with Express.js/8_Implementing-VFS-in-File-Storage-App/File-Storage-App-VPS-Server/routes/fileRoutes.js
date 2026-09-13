import express from "express";
import { createWriteStream } from "fs";
import { rename, rm, writeFile } from "fs/promises";
import path from "path";
import directoriesData from "../directoriesDB.json" with { type: "json" };
import filesData from "../filesDB.json" with { type: "json" };

const router = express.Router();

// Create
router.post("/:filename", async (req, res) => {
  const { filename } = req.params;
  const parentDirId = req.headers.parentdirid || directoriesData[0].id;
  console.log(parentDirId);
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
      parentDirId
    });
    const parentDirData = directoriesData.find((dirData) => dirData.id === parentDirId);
    parentDirData.files.push(fileId);
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
    // writeStream.end();
    res.json({ message: "File uploaded on the server" });
  });
});

// Read
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const fileData = filesData.find((file) => file.id === id);
  console.log(fileData);
  if (req.query.action === "download") {
    res.set("Content-Disposition", `attachment; filename=${fileData.name}`);
  }
  res.sendFile(`${process.cwd()}/storage/${id}${fileData.extension}`, (err) => {
    if (!res.headersSent) res.json({ error: "File Not Found!" });
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
    const parentDirData = directoriesData.find(
      (dir) => dir.id === fileData.parentDirId,
    );
    parentDirData.files = parentDirData.files.filter((fileId) => fileId !== id);
    console.log(parentDirData)
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
    res.json({ message: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

export default router;
