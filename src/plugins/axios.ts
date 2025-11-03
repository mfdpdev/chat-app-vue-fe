import { useAuthStore } from "@/stores/auth";
import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

// Add access token from Pinia
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
}, (error) => {
    return Promise.reject(error)
  });

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response, //eksekusi ketika success
  async (error) => { //eksekusi ketika error
    const authStore = useAuthStore();
    const originalRequest = error.config;

    if ((error.response?.status === 403 && !authStore.refresh) && !originalRequest._retry) {
      originalRequest._retry = true;
      authStore.refresh = true;

      const refreshed = await authStore.refreshToken();
      if (refreshed) {
        return api(originalRequest);
      }
    }

    authStore.refresh = false;
    return Promise.reject(error);
  }
);

export default api
