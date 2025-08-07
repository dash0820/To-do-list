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

export const postTodo = async (Data: Object) => {
  const response = await api.post(
    "/todos/add",
    { id: window.localStorage.getItem("user"), ...Data },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const putTodo = async (id: number, data: Object) => {
  const response = await api.put(
    `/todos/${id}`,
    { ...data },
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
