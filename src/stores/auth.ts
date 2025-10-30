import axios from 'axios';
import { defineStore } from 'pinia';

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, // Penting! agar cookie dikirim
})

export const useAuthStore = defineStore("auth", {
  state: (): any => ({
    accessToken: null,
    _id: null,
    isAuthenticated: false,
  }),

  actions: {
    setTokenAndUser(token: string, _id: any = null): void {
      console.log("run: set token")
      this.accessToken = token;
      this.isAuthenticated = true;
      this._id = _id;

      // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    async login(credentials: any): Promise<void> {
      try {
        console.log("run: login")
        const { data } = await api.post('/auth/signin', credentials);
        const { accessToken, ...userData } = data?.data;

        this.setTokenAndUser(accessToken, userData._id || null);
      } catch (err) {
        console.error('Login failed:', err);
        this.logout();
      }
    },

    async refreshToken() {
      try {
        console.log("run: refresh")
        const { data } = await api.post('/auth/refresh', {}, { withCredentials: true });

        let accessToken = null;

        if (data?.accessToken) {
          this.setTokenAndUser(accessToken);
        } 

        if (!accessToken) {
          console.log("no: access token")
          return null
          // redirect harusnya
        }

        // return true;

      } catch (err) {
        console.log("run: logout")
        this.logout();
        throw err;
      }
    },

    logout() {
      this.accessToken = null;
      this._id = null;
      localStorage.removeItem("_id")
      this.isAuthenticated = false;

      // delete api.defaults.headers.common['Authorization'];
      return api.post('/auth/logout')
    },
  },
})
