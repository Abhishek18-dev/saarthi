import axios from "axios";

const api = axios.create({
  baseURL: "https://ungrateful-noninflationary-pinkie.ngrok-free.dev",
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // CRITICAL: Ensure there is a SPACE after Bearer
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
