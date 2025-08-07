"use client";

import { useEffect, useState } from "react";
import { getTodos, postTodo, putTodo, removeTodo } from "@/api/Todo";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const data = await getTodos();
      setTodos(data);
    };
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;
    const newTodo = await postTodo(input);
    setTodos([newTodo, ...todos]);
    setInput("");
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const updated = await putTodo(id, !todo.completed);
    setTodos(todos.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTodo = async (id: number) => {
    await removeTodo(id);
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">My To-Do List</h1>
      <div className="flex mb-4 w-full max-w-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
          className="flex-grow px-4 py-2 border rounded-l"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <ul className="w-full max-w-md">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center bg-white px-4 py-2 mb-2 rounded shadow"
          >
            <span
              onClick={() => toggleTodo(todo.id)}
              className={`cursor-pointer ${
                todo.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
