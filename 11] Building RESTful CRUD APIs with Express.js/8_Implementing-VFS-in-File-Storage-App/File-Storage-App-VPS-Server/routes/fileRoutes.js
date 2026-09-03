import express from "express";
import { createWriteStream } from "fs";
import { rename, rm } from "fs/promises";
import path from "path";

const router = express.Router();

// Create
router.post("/*", async (req, res) => {
  const filePath = path.join("/", req.params[0]);
  const writeStream = createWriteStream(`./storage/${filePath}`);
  req.pipe(writeStream);
  req.on("end", () => {
    writeStream.end();
    res.json({ message: "File uploaded on the server" });
  });
});

// Download and open Files
router.get("/*", (req, res) => {
  const filePath = path.join("/", req.params[0]);
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }
  res.sendFile(`${process.cwd()}/storage/${filePath}`, (err) => {
    if (err) res.json({ error: "File Not Found!" });
  });
});

// Update
router.patch("/*", async (req, res) => {
  const filePath = path.join("/", req.params[0]);
  try {
    await rename(`./storage/${filePath}`, `./storage/${req.body.newFilename}`);
    res.json({ message: "Renamed Successfully" });
  } catch (error) {
    res.json({ message: "Rename Failed!" });
  }
});

// Delete
router.delete("/*", async (req, res) => {
  const filePath = path.join("/", req.params[0]);
  const fullPath = `./storage/${filePath}`;
  try {
    await rm(fullPath, { recursive: true });
    res.json({ message: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

export default router;
