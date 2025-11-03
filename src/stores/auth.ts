import { defineStore } from 'pinia';
import api from "@/plugins/axios"

export const useAuthStore = defineStore("auth", {
  state: (): any => ({
    accessToken: null,
    _id: null,
    isAuthenticated: false,
    init: false,
    refresh: false,
  }),

  actions: {
    setTokenAndUser(token: string, _id: any = null): void {
      this.accessToken = token;
      this.isAuthenticated = true;
      this._id = _id;

      // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    async login(credentials: any): Promise<void> {
      try {
        const { data } = await api.post('/auth/signin', credentials);
        const { accessToken, ...userData } = data?.data;

        this.setTokenAndUser(accessToken, userData._id || null);
      } catch (err) {
        this.logout();
      }
    },

    async refreshToken() {
      try {
        const { data } = await api.post('/auth/refresh', {}, { withCredentials: true });

        let accessToken = data?.data?.accessToken;
        
        if (accessToken) {
          this.setTokenAndUser(accessToken);
          return true
        }else{
          this.logout();
          return false;
        } 
      } catch (err) {
        this.logout();
        return false;
      } finally {
        this.init = true;
      }
    },

    async test(){
      this.init = true;
    },

    async logout() {
      if(this.accessToken){
        await api.delete('/auth/signout', {
          withCredentials: true,
        });
      }

      this.accessToken = null;
      this._id = null;
      this.isAuthenticated = false;
    },
  },
})
