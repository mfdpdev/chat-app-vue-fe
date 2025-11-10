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

let isRefreshing = false;
let queue: [] = [];

const processQueue = (error, token = null) => {
  queue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  queue = [];
};

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response, //eksekusi ketika success
  async (error) => { //eksekusi ketika error
    const authStore = useAuthStore();
    const originalRequest = error.config;

    //TAMBAHKAN PENGECEKAN URL
    // const isSignoutRequest = originalRequest.url.includes('/auth/signout');
    const isRefreshRequest = originalRequest.url.includes('/auth/refresh');
    //
    // // JANGAN retry refresh token jika refresh sendiri gagal
    if (isRefreshRequest && error.response?.status === 401) {
      // Langsung reject, jangan retry
      return Promise.reject(error);
    }
    //
    // // JANGAN refresh token saat logout
    // if (isSignoutRequest && error.response?.status === 401) {
    //   console.log("jalan")
    //   return Promise.reject(error); // Biarkan masuk catch di logout()
    // }

    if(error.response?.status === 401 && !originalRequest._retry){
      if(isRefreshing){
        return new Promise((resolve, reject) => {
          queue.push({
            resolve,
            reject,
          });
        }).then(() => {
            if (authStore.accessToken) {
              originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
            }
            return api(originalRequest);
          }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await authStore.refreshToken();
        if (authStore.accessToken) {
          originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
        }

        processQueue(null, authStore.accessToken)
        return api(originalRequest);
      } catch (e) {
        processQueue(e, authStore.accessToken)
        authStore.forceLogout();

        return Promise.reject(e)
        // throw e;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api
