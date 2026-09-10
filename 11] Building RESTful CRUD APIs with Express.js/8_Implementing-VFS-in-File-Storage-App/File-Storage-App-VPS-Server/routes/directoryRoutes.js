import express from "express";
import { mkdir, readdir, stat } from "fs/promises";
import path from "path";
import directoriesData from "../directoriesDB.json" with { type: "json" };
import filesData from "../filesDB.json" with { type: "json" };

const router = express.Router();

// Directory Read
router.get("/:id?", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    const dirData = directoriesData[0];
    const files = dirData.files.map((fileId) =>
      filesData.find((file) => file.id === fileId),
    );
    res.json({ ...dirData, files });
  } else {
    const dirData = directoriesData.find((directory) => directory.id === id);
    res.json(dirData);
  }
});

// Directory Create
router.post("/*", async (req, res) => {
  const filePath = path.join("/", req.params[0]);
  try {
    await mkdir(`./storage/${filePath}/${req.body.newDirName}`);
    res.json({ message: "Directory Created Successfully" });
  } catch (error) {
    res.json({ message: "Directory Creation Failed!" });
  }
});

export default router;
