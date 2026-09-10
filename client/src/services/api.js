import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("skillbridge_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response || error.code === "ERR_NETWORK" || error.message?.toLowerCase().includes("network error")) {
      window.dispatchEvent(
        new CustomEvent("skillbridge:network-error", {
          detail: {
            message: "Unable to connect to SkillBridge server. Please check your internet or retry.",
          },
        })
      );
    }
    return Promise.reject(error);
  }
);

export default api;
