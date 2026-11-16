import express from "express";
import validateIdMiddleware from "../middlewares/validateIdMiddleware.js";
import {
  uploadFile,
  deleteFile,
  getFile,
  renameFile,
} from "../controllers/fileController.js";

const router = express.Router();

/// Runs first before any middleware with ":parentDirId" param
router.param("parentDirId", validateIdMiddleware);
/// Runs first before any middleware with ":id" param
router.param("id", validateIdMiddleware);

router.post("/:parentDirId?", uploadFile);

router.route("/:id").get(getFile).patch(renameFile).delete(deleteFile);

// router.patch("/:id", renameFile);

// router.delete("/:id", deleteFile);

export default router;
