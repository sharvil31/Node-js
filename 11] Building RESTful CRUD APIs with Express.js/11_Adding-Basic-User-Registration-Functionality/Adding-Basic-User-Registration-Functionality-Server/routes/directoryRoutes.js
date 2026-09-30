import express from "express";
import { rm, writeFile } from "fs/promises";
import directoriesData from "../directoriesDB.json" with { type: "json" };
import filesData from "../filesDB.json" with { type: "json" };
import usersData from "../usersDB.json" with { type: "json" };

const router = express.Router();

// Directory Read
router.get("/:id?", async (req, res) => {
  
  const id = req.params.id || directoriesData[0]?.id;
  const dirData = directoriesData.find((directory) => directory.id === id);
  if (!dirData) {
    return res.status(404).json({ message: "Directory Not Found!" });
  }
  const files = dirData.files.map((fileId) =>
    filesData.find((file) => file.id === fileId),
  );
  const directories = dirData.directories
    .map((dirId) => directoriesData.find((dir) => dir.id === dirId))
    .map(({ id, name }) => ({ id, name }));
  return res.status(200).json({ ...dirData, files, directories });
});

// Directory Create
router.post("/:parentDirId?", async (req, res, next) => {
  const parentDirId = req.params.parentDirId || directoriesData[0]?.id;
  const dirname = req.headers.dirname || "New Folder";
  const id = crypto.randomUUID();
  const parentDir = directoriesData.find((dir) => dir.id === parentDirId);
  if (!parentDir) {
    return res
      .status(404)
      .json({ message: "Parent directory does not exist!" });
  }
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
    return res.status(200).json({ message: "Directory Created Successfully" });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { newDirName } = req.body;
  const dirData = directoriesData.find((dir) => dir.id === id);
  if (!dirData) {
    return res.status(404).json({ message: "Directory Not Found!" });
  }
  dirData.name = newDirName;
  try {
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
    return res.status(200).json({ message: "Directory Renamed Successfully" });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const dirData = directoriesData.find((dir) => dir.id === id);

    if (!dirData) {
      return res.status(404).json({
        message: "Directory not found",
      });
    }

    // Recursively delete a directory and everything inside it
    async function deleteDirectory(directoryId) {
      const directory = directoriesData.find((dir) => dir.id === directoryId);
      if (!directory) return;

      // 1. Delete all files inside this directory
      for (const fileId of directory.files) {
        const fileIndex = filesData.findIndex((file) => file.id === fileId);

        if (fileIndex === -1) continue;

        const fileData = filesData[fileIndex];

        // Delete actual file from storage
        await rm(`./storage/${fileId}${fileData.extension}`);

        // Delete file from filesDB
        filesData.splice(fileIndex, 1);
      }

      // 2. Recursively delete all child directories
      for (const childDirId of directory.directories) {
        await deleteDirectory(childDirId);
      }

      // 3. Delete this directory from directoriesDB
      const dirIndex = directoriesData.findIndex(
        (dir) => dir.id === directoryId,
      );

      if (dirIndex !== -1) {
        directoriesData.splice(dirIndex, 1);
      }
    }

    // Delete selected directory recursively
    await deleteDirectory(id);

    // 4. Remove selected directory from its parent's directories array
    const parentDir = directoriesData.find(
      (dir) => dir.id === dirData.parentDirId,
    );

    if (parentDir) {
      parentDir.directories = parentDir.directories.filter(
        (dirId) => dirId !== id,
      );
    }

    // 5. Save both databases
    await writeFile("./filesDB.json", JSON.stringify(filesData, null, 2));
    await writeFile(
      "./directoriesDB.json",
      JSON.stringify(directoriesData, null, 2),
    );

    return res.status(200).json({
      message: "Directory Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
