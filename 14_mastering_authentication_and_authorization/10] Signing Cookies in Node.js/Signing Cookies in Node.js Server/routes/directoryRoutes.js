import express from "express";
import validateIdMiddleware from "../middlewares/validateIdMiddleware.js";
import {
  createDirectory,
  deleteDirectory,
  getDirectoryById,
  renameDirectory,
} from "../controllers/directoryController.js";

const router = express.Router();

router.param("parentDirId", validateIdMiddleware);
router.param("id", validateIdMiddleware);

router.get("/:id?", getDirectoryById);
router.post("/:parentDirId?", createDirectory);
router.route("/:id").patch(renameDirectory).delete(deleteDirectory);

// router.delete("/:id", deleteDirectory);

export default router;
