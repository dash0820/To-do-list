import { Router } from "express";
import verifyToken from "../util/verifyToken";
import {
  getTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
} from "../controllers/todoController";

const router = Router();

router.post("/", verifyToken, getTodos);
router.post("/add", verifyToken, createTodo);
router.put("/:id", verifyToken, toggleTodo);
router.delete("/:id", verifyToken, deleteTodo);

export default router;
