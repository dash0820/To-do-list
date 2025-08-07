"use client";
import debounce from "lodash.debounce";
import { useEffect, useState, useRef } from "react";
import { getTodos, postTodo, putTodo, removeTodo } from "@/api/Todo";
import Button from "../common/Button"; // Importing the Button component
import Input from "../common/Input"; // Importing the Input component
import Textarea from "../common/Textarea"; // Importing the Textarea component
import { useRouter } from "next/navigation"; // Importing router for navigation

type Todo = {
  id: number;
  title: string;
  description: string;
  tag: string;
  startDate: string;
  endDate: string;
  completed: boolean;
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState<Todo>({
    id: 0,
    title: "",
    description: "",
    tag: "",
    startDate: "",
    endDate: "",
    completed: false,
  });
  const [notification, setNotification] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmSignOut, setShowConfirmSignOut] = useState(false); // State to show sign-out confirmation

  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTodos = async () => {
      const data = await getTodos();
      setTodos(data);
      setFilteredTodos(data);
    };
    fetchTodos();
  }, []);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const addTodo = () => {
    setShowModal(true);
    setModalData(null);
    setNewTodo({
      id: 0,
      title: "",
      description: "",
      tag: "",
      startDate: "",
      endDate: "",
      completed: false,
    });
  };

  const editTodo = (todo: Todo) => {
    setModalData(todo);
    setShowModal(true);
    setNewTodo({ ...todo });
  };

  const handleModalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTodo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveTodo = async () => {
    const { title, description, startDate, endDate } = newTodo;

    if (!title || !description || !startDate) {
      setNotification("Title, Description, and Start Date are required!");
      setTimeout(() => setNotification(null), 2000);
      return;
    }

    if (modalData) {
      const updated = await putTodo(modalData.id, newTodo);
      setTodos(todos.map((t) => (t.id === updated.id ? updated : t)));
      setFilteredTodos(
        filteredTodos.map((t) => (t.id === updated.id ? updated : t))
      );
    } else {
      const created = await postTodo(newTodo);
      setTodos([created, ...todos]);
      setFilteredTodos([created, ...filteredTodos]);
    }

    setShowModal(false);
  };

  const deleteTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setTodoToDelete(todo);
      setShowConfirmDelete(true);
    }
  };

  const confirmDelete = async () => {
    if (todoToDelete) {
      await removeTodo(todoToDelete.id);
      setTodos(todos.filter((t) => t.id !== todoToDelete.id));
      setFilteredTodos(filteredTodos.filter((t) => t.id !== todoToDelete.id));
    }
    setShowConfirmDelete(false);
    setTodoToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setTodoToDelete(null);
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const updated = await putTodo(id, { ...todo, completed: !todo.completed });
    setTodos(todos.map((t) => (t.id === id ? updated : t)));
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const handleSearch = debounce((query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredTodos(todos);
    } else {
      setFilteredTodos(
        todos.filter(
          (todo) =>
            todo.title.toLowerCase().includes(query.toLowerCase()) ||
            todo.description.toLowerCase().includes(query.toLowerCase()) ||
            todo.tag.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, 500);

  const handleSignOut = () => {
    setShowConfirmSignOut(true);
  };

  const confirmSignOut = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    router.push("/signin");
    setShowConfirmSignOut(false);
  };

  const cancelSignOut = () => {
    setShowConfirmSignOut(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center relative">
      <h1 className="text-3xl font-bold mb-6">My To-Do List</h1>
      <Button
        onClick={handleSignOut}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Sign Out
      </Button>
      <div className="flex mb-4 w-full max-w-md justify-between">
        <Button onClick={addTodo}>Add</Button>
        <Input
          type="text"
          name="search"
          placeholder="Search tasks..."
          onChange={(e) => handleSearch(e.target.value)}
          className="ml-4"
        />
      </div>

      {/* Notification UI */}
      {notification && (
        <div className="absolute z-10 bg-red-500 text-white p-2 mb-4 rounded">
          {notification}
        </div>
      )}

      <ul className="w-full max-w-md">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center bg-white px-4 py-2 mb-2 rounded shadow"
          >
            <span
              onClick={() => toggleTodo(todo.id)}
              className={`cursor-pointer ${
                todo.completed ? "line-through text-gray-400" : ""
              } truncate max-w-xs`}
            >
              {todo.title}
            </span>
            <div>
              <button
                onClick={() => editTodo(todo)}
                className="text-blue-500 hover:text-blue-700 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div
            className="bg-white p-6 rounded shadow-md w-full max-w-lg"
            style={{ width: "500px" }}
            ref={modalRef}
          >
            <h2 className="text-xl mb-4">
              {modalData ? "Edit Task" : "Add Task"}
            </h2>

            <div>
              <label className="block mb-2">Title</label>
              <Input
                name="title"
                value={newTodo.title}
                onChange={handleModalChange}
              />
            </div>

            <div>
              <label className="block mb-2">Description</label>
              <Textarea
                name="description"
                value={newTodo.description}
                onChange={handleModalChange}
              />
            </div>

            <div>
              <label className="block mb-2">Tag</label>
              <Input
                name="tag"
                value={newTodo.tag}
                onChange={handleModalChange}
              />
            </div>

            <div className="flex mb-4">
              <div className="w-1/2 mr-2">
                <label className="block mb-2">Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  value={
                    newTodo.startDate
                      ? formatDate(new Date(newTodo.startDate))
                      : ""
                  }
                  onChange={handleModalChange}
                />
              </div>
              <div className="w-1/2 ml-2">
                <label className="block mb-2">End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  value={
                    newTodo.endDate ? formatDate(new Date(newTodo.endDate)) : ""
                  }
                  onChange={handleModalChange}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={saveTodo}>
                {modalData ? "Update" : "Save"}
              </Button>
              <Button
                onClick={() => setShowModal(false)}
                className="bg-gray-500"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {showConfirmSignOut && (
        <div className="fixed inset-0 bg-gray-100 opacity-90 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-xl mb-4">Are you sure you want to sign out?</h2>
            <div className="flex justify-end">
              <Button onClick={confirmSignOut} className="bg-red-500">
                Yes
              </Button>
              <Button onClick={cancelSignOut} className="bg-gray-500">
                No
              </Button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-gray-100 opacity-90 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-xl mb-4">
              Are you sure you want to delete this task?
            </h2>
            <div className="flex justify-end">
              <Button onClick={confirmDelete} className="bg-red-500">
                Yes
              </Button>
              <Button onClick={cancelDelete} className="bg-gray-500">
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
