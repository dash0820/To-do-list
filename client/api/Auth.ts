import api from "./index";

interface AuthPayload {
  email: string;
  password: string;
}

export const signup = async (payload: AuthPayload) => {
  const response = await api.post(`/auth/signup`, payload, {
    withCredentials: true,
  });
  return response.data;
};

export const signin = async (payload: AuthPayload) => {
  const response = await api.post(`/auth/signin`, payload, {
    withCredentials: true,
  });
  return response.data;
};
