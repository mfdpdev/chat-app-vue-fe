import { defineStore } from "pinia";
import api from "@/plugins/axios"
import { useAuthStore } from "./auth";

export const useUserStore = defineStore("user", {
  state: () => ({
    authStore: useAuthStore(),
  }),
  actions: {
    async update(credentials: any){
      try {
        const { data } = await api.patch('/users', credentials, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.authStore.me = data.data
      } catch (err) {
        throw err;
      }
    }
  }
});
