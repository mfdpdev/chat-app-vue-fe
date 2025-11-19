import { defineStore } from "pinia";
import api from "@/plugins/axios"
import { useAuthStore } from "./auth";
import { useSocketStore } from "./socket";

export const useConversationStore = defineStore("user", {
  state: () => ({
    conversations: [], 
  }),
  actions: {
    fetchConversations(){
      const socketStore = useSocketStore();
      socketStore.socket.emit('fetch-conversations-history');
    },
    handleConversations(){
      const socketStore = useSocketStore();
      socketStore.socket.on("conversations-history", (conversations: any) => {
        this.conversations = conversations;
      })
    }
  }
});
