import api from "./index";

export const getTodos = async () => {
  const response = await api.post(
    "/todos",
    { id: window.localStorage.getItem("user") },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const postTodo = async (text: string) => {
  const response = await api.post(
    "/todos/add",
    { id: window.localStorage.getItem("user"), text: text },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const putTodo = async (id: number, completed: boolean) => {
  const response = await api.put(
    `/todos/${id}`,
    { completed },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const removeTodo = async (id: number) => {
  const response = await api.delete(`/todos/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
