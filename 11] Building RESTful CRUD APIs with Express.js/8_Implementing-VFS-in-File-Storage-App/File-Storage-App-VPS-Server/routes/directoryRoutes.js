import express from "express";
import { rm, writeFile } from "fs/promises";
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

    res.json({
      message: "Directory Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Directory Deletion Failed",
      error: error.message,
    });
  }
});

export default router;
