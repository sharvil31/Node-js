import express from "express";
import {
  addTodo,
  deleteTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
} from "../controllers/todoController.js";

const router = express.Router();

// router.post("/", addTodo);
// router.get("/", getAllTodos);
// router.get("/:id", getTodoById);
// router.put("/:id", updateTodo);
// router.delete("/:id", deleteTodo);

router.route("/").post(addTodo).get(getAllTodos);
router.route("/:id").get(getTodoById).put(updateTodo).delete(deleteTodo);

export default router;
