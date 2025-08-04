import { Request, Response } from "express";
import User from "../models/User";
import Todo from "../models/Todo";

export const getTodos = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ where: { email: req.body.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const todos = await Todo.findAll({ where: { userId: user.id } });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch todos" });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ where: { email: req.body.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const todo = await Todo.create({
      text: req.body.text,
      userId: user.id,
    });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: "Failed to create todo" });
  }
};

export const toggleTodo = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.completed = !todo.completed;
    await todo.save();

    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: "Failed to update todo" });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    await todo.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete todo" });
  }
};
