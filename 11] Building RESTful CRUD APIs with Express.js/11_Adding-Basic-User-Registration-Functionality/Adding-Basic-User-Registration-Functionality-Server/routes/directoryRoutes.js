import express from "express";
import { rm, writeFile } from "fs/promises";
import directoriesData from "../directoriesDB.json" with { type: "json" };
import filesData from "../filesDB.json" with { type: "json" };
import usersData from "../usersDB.json" with { type: "json" };

const router = express.Router();

// Read
router.get("/:id?", async (req, res) => {
  const user = req.user;
  const id = req.params.id || user.rootDirId;

  // Find the directory and verify ownership
  const directoryData = directoriesData.find(
    (directory) => directory.id === id && directory.userId === user.id,
  );
  if (!directoryData) {
    return res
      .status(404)
      .json({ error: "Directory not found or you do not have access to it!" });
  }

  const files = directoryData.files.map((fileId) =>
    filesData.find((file) => file.id === fileId),
  );
  const directories = directoryData.directories
    .map((dirId) => directoriesData.find((dir) => dir.id === dirId))
    .map(({ id, name }) => ({ id, name }));

  return res.status(200).json({ ...directoryData, files, directories });
});

router.post("/:parentDirId?", async (req, res, next) => {
  const user = req.user;
  const parentDirId = req.params.parentDirId || user.rootDirId;
  const dirname = req.headers.dirname || "New Folder";
  const id = crypto.randomUUID();
  const parentDir = directoriesData.find((dir) => dir.id === parentDirId);
  if (!parentDir)
    return res
      .status(404)
      .json({ message: "Parent Directory Does not exist!" });
  parentDir.directories.push(id);
  directoriesData.push({
    id,
    name: dirname,
    parentDirId,
    files: [],
    userId: user.id,
    directories: [],
  });
  try {
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
    return res.status(200).json({ message: "Directory Created!" });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const { newDirName } = req.body;

  const dirData = directoriesData.find((dir) => dir.id === id);
  if (!dirData)
    return res.status(404).json({ message: "Directory not found!" });

  // Check if the directory belongs to the user
  if (dirData.userId !== user.id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to rename this directory!" });
  }

  dirData.name = newDirName;
  try {
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
    res.status(200).json({ message: "Directory Renamed!" });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;

  const dirIndex = directoriesData.findIndex(
    (directory) => directory.id === id,
  );
  if (dirIndex === -1)
    return res.status(404).json({ message: "Directory not found!" });

  const directoryData = directoriesData[dirIndex];

  // Check if the directory belongs to the user
  if (directoryData.userId !== user.id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this directory!" });
  }

  try {
    const dirData = directoriesData.find((dir) => dir.id === id);

    if (!dirData) {
      return res.status(404).json({
        message: "Directory not found",
      });
    }

    // Recursively delete a directory and everything inside it
    async function deleteDirectory(directoryId) {
      if (dirIndex === -1)
        return res.status(404).json({ message: "Directory not found!" });

      const directoryData = directoriesData[dirIndex];

      // Check if the directory belongs to the user
      if (directoryData.userId !== user.id) {
        return res.status(403).json({
          message: "You are not authorized to delete this directory!",
        });
      }
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
