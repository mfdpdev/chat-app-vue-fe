import { defineStore } from "pinia";
import api from "@/plugins/axios"
import { useAuthStore } from "@/stores/auth";

export const useUserStore = defineStore("user", {
  state: () => ({
  }),
  actions: {
    async update(credentials: any){
      try {
        const { data } = await api.patch('/users', credentials, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const authStore = useAuthStore();
        authStore.me = data.data
      } catch (err) {
        throw err;
      }
    },
  }
});
