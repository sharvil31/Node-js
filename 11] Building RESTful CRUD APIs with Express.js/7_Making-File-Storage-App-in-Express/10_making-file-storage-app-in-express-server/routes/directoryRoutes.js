import express from "express";
import { mkdir, readdir, stat } from "fs/promises";
import path from "path";

const router = express.Router();

// Directory Read
router.get("/?*", async (req, res) => {
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
