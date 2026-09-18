import express from "express";
import { createWriteStream } from "fs";
import { rm, writeFile } from "fs/promises";
import path from "path";
import directoriesData from "../directoriesDB.json" with { type: "json" };
import filesData from "../filesDB.json" with { type: "json" };

const router = express.Router();

// Create
router.post("/:parentDirId?", async (req, res, next) => {
  const parentDirId = req.params.parentDirId || directoriesData[0].id;
  const filename = req.headers.filename || "untitled";
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
      parentDirId,
    });
    const parentDirData = directoriesData.find(
      (dirData) => dirData.id === parentDirId,
    );
    parentDirData.files.push(fileId);
    try {
      await writeFile("./filesDB.json", JSON.stringify(filesData));
      await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
      return res.status(201).json({ message: "File uploaded" });
    } catch (error) {
      next(error);
    }
  });
});

// Read
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const fileData = filesData.find((file) => file.id === id);

  if (!fileData) return res.status(404).json({ message: "File Not Found!" });

  if (req.query.action === "download") {
    res.set("Content-Disposition", `attachment; filename=${fileData.name}`);
  }

  return res.sendFile(
    `${process.cwd()}/storage/${id}${fileData.extension}`,
    (err) => {
      if (!res.headersSent && err) {
        return res.status(404).json({ error: "File Not Found!" });
      }
    },
  );
});

// Update
router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { newFilename } = req.body;
  const fileData = filesData.find((file) => file.id === id);
  fileData.name = newFilename;
  try {
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    return res.status(200).json({ message: "Renamed Successfully" });
  } catch (error) {
    // res.json({ message: "Rename Failed!" });
    error.status = 500;
    next(error); // calls global error middleware in app.js
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  const fileIndex = filesData.findIndex((file) => file.id === id);

  if (fileIndex === -1)
    return res.status(404).json({ message: "File Not Found!" });

  const fileData = filesData[fileIndex];
  const fullPath = `./storage/${id}${fileData.extension}`;
  try {
    await rm(fullPath, { recursive: true });
    filesData.splice(fileIndex, 1);
    const parentDirData = directoriesData.find(
      (dir) => dir.id === fileData.parentDirId,
    );
    parentDirData.files = parentDirData.files.filter((fileId) => fileId !== id);
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
    return res.status(200).json({ message: "File Deleted Successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
