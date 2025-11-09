import { defineStore } from 'pinia';
import { ref } from 'vue';
import { io } from 'socket.io-client';

export const useSocketStore = defineStore("store", () => {
  const socket: any = ref(null);
  const messages = ref([]);
  // const onlineUsers = ref(new Set());
  const onlineUsers = ref([]);

  const connect = (_id: any, accessToken: string) => {
    if(!socket.value){
      socket.value = io('http://localhost:8000', {
        query: {
          userId: _id,
        }, 
        auth: {
          accessToken: accessToken ?? "",
        }
      });

      socket.value.on('connect', () => {
        console.log('Connected as:', socket.value.id);
      });

      socket.value.on('online-users', (users) => {
        // onlineUsers.value = new Set(users);
        onlineUsers.value = [];
      });

      socket.value.on('receive-message', (msg) => {
        messages.value.push(msg);
      });
    }
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      // onlineUsers.value = new Set();
      onlineUsers.value = [];
    }
  };

  const send = (msg) => {
    if (!socket.value) return;
    socket.value.emit('send-message', msg);
  };

  const sendTyping = (to: string, isTyping: boolean) => {
    socket.value?.emit('typing', { to, isTyping })
  }

  return { socket, onlineUsers, messages, connect, disconnect, send, sendTyping };
});
