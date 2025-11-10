import { defineStore } from 'pinia';
import api from "@/plugins/axios"
import { useSocketStore } from './socket';
import router from '@/router';

export const useAuthStore = defineStore("auth", {
  state: (): any => ({
    accessToken: "",
    me: null,
    init: false,
    refresh: false,
  }),

  actions: {
    setAccessToken(access) {
      this.accessToken = access;
    },
    clearAccessToken() {
      this.accessToken = null;
    },
    setMe(){

    },

    setTokenAndUser(token: string, me: any = null): void {
      this.accessToken = token;
      this.isAuthenticated = true;
      if(!this.me){
        this.me = me;
      }

      // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    async getMe(){
      try {
        if(!this.me && this.accessToken){
          const result = await api.get('/auth/me');
          this.me = result?.data.data.user;
          return true
        }

        return false;
      } catch (err){
        return false
      }
    },

    async register(credentials: any): Promise<boolean> {
      try {
        const _ = await api.post('/auth/signup', credentials);
        return true
      } catch (err){
        return false
      }
    },

    async login(credentials: any): Promise<boolean> {
      try {
        const { data } = await api.post('/auth/signin', credentials);
        const { accessToken, ...userData } = data?.data;

        this.setTokenAndUser(accessToken, {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
        });
        const socketStore = useSocketStore();
        socketStore.connect(this.me._id, this.accessToken);
        return true;
      } catch (err) {
        // this.logout();
        throw err;
      }
    },

    async refreshToken() {
      try {
        const { data } = await api.post('/auth/refresh', {}, { 
          withCredentials: true,
          headers: {
            Authorization: "",
          }
        });

        let accessToken = data?.data?.accessToken;
        
        if (accessToken) {
          this.setTokenAndUser(accessToken);
          return true;
        }

        throw new Error("Error")
      } catch (err) {
        throw err;
      } 
    },

    async logout() {
      try {
        await api.delete('/auth/signout', {
          withCredentials: true,
        });
      } catch (err) {
        throw err;
      } finally {
        this.accessToken = null;
        this.isAuthenticated = false;
        const socket = useSocketStore();
        socket.disconnect();

        router.push({
          name: "login"
        })
      }
    },

    forceLogout(){
      this.accessToken = null;
      this.isAuthenticated = false;
      const socket = useSocketStore();
      socket.disconnect();

      router.push({
        name: "login"
      })
    }
  },
})
