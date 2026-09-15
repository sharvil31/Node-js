import express from "express";
import { mkdir, readdir, rm, stat, writeFile } from "fs/promises";
import path from "path";
import directoriesData from "../directoriesDB.json" with { type: "json" };
import filesData from "../filesDB.json" with { type: "json" };

const router = express.Router();

// Directory Read
router.get("/:id?", async (req, res) => {
  const { id } = req.params;
  const dirData = id
    ? directoriesData.find((directory) => directory.id === id)
    : directoriesData[0];
  const files = dirData.files.map((fileId) =>
    filesData.find((file) => file.id === fileId),
  );
  const directories = dirData.directories
    .map((dirId) => directoriesData.find((dir) => dir.id === dirId))
    .map(({ id, name }) => ({ id, name }));
  res.json({ ...dirData, files, directories });
});

// Directory Create
router.post("/:parentDirId?", async (req, res) => {
  const parentDirId = req.params.parentDirId || directoriesData[0].id;
  const { dirname } = req.headers;
  const id = crypto.randomUUID();
  const parentDir = directoriesData.find((dir) => dir.id === parentDirId);
  parentDir.directories.push(id);
  directoriesData.push({
    id,
    name: dirname,
    parentDirId,
    files: [],
    directories: [],
  });
  try {
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
    res.json({ message: "Directory Created Successfully" });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { newDirName } = req.body;
  const dirData = directoriesData.find((dir) => dir.id === id);
  dirData.name = newDirName;
  try {
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
    res.json({ message: "Directory Renamed Successfully" });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dirIndex = directoriesData.findIndex((dir) => dir.id === id);
    const dirData = directoriesData[dirIndex];
    // remove directory from directoriesDB
    directoriesData.splice(dirIndex, 1);

    // Delete actual files from parent storage folder and from filesDB of deleted directory
    for await (const fileId of dirData.files) {
      const fileIndex = filesData.findIndex((file) => file.id === fileId);
      const fileData = filesData[fileIndex];
      await rm(`./storage/${fileId}${fileData.extension}`);
      filesData.splice(fileIndex, 1);
    }

    // remove directories of deleted directory from directoriesDB 
    for await (const dirId of dirData.directories) {
      const dirIndex = directoriesData.findIndex((dir) => dir.id === dirId);
      directoriesData.splice(dirIndex, 1);
    }

    // delete dirId of deleted directory from its parent.directories 
    const parentDirData = directoriesData.find((dir) => dir.id === dirData.parentDirId);
    parentDirData.directories = parentDirData.directories.filter(
      (dirId) => dirId !== id,
    );
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
    res.json({ message: "Directory Deleted!" });
  } catch (error) {
    console.log(error);
    res.json({ err: error.message });
  }
});

export default router;
