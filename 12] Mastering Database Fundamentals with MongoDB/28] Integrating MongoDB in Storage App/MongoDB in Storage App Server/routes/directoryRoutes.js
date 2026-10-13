import express from "express";
import { rm, writeFile } from "fs/promises";
import directoriesData from "../directoriesDB.json" with { type: "json" };
import filesData from "../filesDB.json" with { type: "json" };
import validateIdMiddleware from "../middlewares/validateIdMiddleware.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// / Runs first before any middleware with ":parentDirId" param
router.param("parentDirId", validateIdMiddleware);
// / Runs first before any middleware with ":id" param
router.param("id", validateIdMiddleware);

// Read
router.get("/:id?", async (req, res) => {
  const db = req.db;
  const user = req.user;
  const id = req.params.id || user.rootDirId.toString();
  const dirCollection = db.collection("directories");

  const directoryData = await dirCollection.findOne(
    { _id: new ObjectId(id) },
    { userId: new ObjectId(user.id) },
  );

  if (!directoryData) {
    return res
      .status(404)
      .json({ error: "Directory not found or you do not have access to it!" });
  }

  const files = [];
 
  const directories = await dirCollection
    .find({ parentDirId: new ObjectId(id) })
    .toArray();

  return res.status(200).json({
    ...directoryData,
    files,
    directories: directories.map((dir) => ({ ...dir, id: dir._id })),
  });
});

router.post("/:parentDirId?", async (req, res, next) => {
  const user = req.user;
  const db = req.db;
  const parentDirId = req.params.parentDirId || user.rootDirId.toString();
  const dirname = req.headers.dirname || "New Folder";

  try {
    const parentDir = await db
      .collection("directories")
      .findOne({ _id: new ObjectId(parentDirId) });
    if (!parentDir)
      return res
        .status(404)
        .json({ message: "Parent Directory Does not exist!" });

    await dirCollection.insertOne({
      name: dirname,
      parentDirId: new ObjectId(parentDirId),
      userId: user._id,
    });
    return res.status(200).json({ message: "Directory Created!" });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const { newDirName } = req.body;
  const db = req.db;
  const dirCollection = db.collection("directories");

  try {
    const dirRes = await dirCollection.updateOne(
      { _id: new ObjectId(id), userId: user._id },
      { $set: { name: newDirName } },
    );
    console.log(dirRes);

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
