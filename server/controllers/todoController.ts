import { Request, Response } from "express";
import User from "../models/User";
import Todo from "../models/Todo";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

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
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const todo = await Todo.create({
      title: req.body.title,
      description: req.body.description,
      tag: req.body.tag,
      startDate: req.body.startDate ? new Date(req.body.startDate) : null,
      endDate: req.body.endDate ? new Date(req.body.endDate) : null,
      completed: req.body.completed ?? false,
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

    Object.assign(todo, req.body);
    await todo.save();

    res.json(todo);
  } catch (err) {
    console.log(err, "===============");
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
