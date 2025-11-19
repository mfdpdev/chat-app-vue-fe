import { defineStore } from 'pinia';
import { ref } from 'vue';
import { io } from 'socket.io-client';
import { useAuthStore } from './auth';
import { useConversationStore } from './conversation';

export const useSocketStore = defineStore("store", () => {
  const socket: any = ref(null);
  const messages = ref<Map<string, any[]>>(new Map());
  // const messages = ref<[]>();
  // const onlineUsers = ref(new Set());
  const onlineUsers = ref([]);

  const authStore = useAuthStore();

  const getChatKey = (u1: string, u2: string) => [u1, u2].sort().join('-')

  const getMessages = (recipientId: string) => {
    if (!authStore.me?._id) return [];
    const key = getChatKey(authStore.me?._id, recipientId)
    return messages.value.get(key) || []
  }

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
        onlineUsers.value = users;
      });

      socket.value.on('receive-message', (message) => {
        addMessage(message);
      });

      socket.value.on('message-history', (conversation) => {
        //const key = getChatKey(history[0]?.sender || currentUserId.value, history[0]?.target || currentUserId.value)
        if(!conversation || !conversation.messages) return;
      
        const otherUserId = conversation.participants.find( id => id !== authStore.me?._id);

        if(!otherUserId) return;

        const key = getChatKey(authStore.me?._id, otherUserId);
        const formatted = conversation.messages.map( msg => ({
          _id: msg._id,
          from: msg.senderId,
          to: msg.recipientId,
          message: msg.message,
          createdAt: msg.createdAt,
        }));

        //// Ganti semua pesan lama dengan history dari DB
        messages.value.set(key, formatted)
        //console.log('History loaded:', formatted.length, 'messages')
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

  const addMessage = (
    message: any,
  ) => {
    const from = message.senderId;
    const to = message.recipientId;
    const key = getChatKey(from, to)
    const chat = messages.value.get(key) || []

    // Cek duplikat berdasarkan tempId atau konten + waktu
    const exists = chat.some( m => m._id && m._id === message._id);

    if (!exists) {
      chat.push({
        _id: message._id,
        from,
        to,
        message: message.message,
        createdAt: message.createdAt,
      })
      messages.value.set(key, chat)
    }
  }

  const send = ({ recipientId, message }) => {
    if (!socket.value) return;
    //addMessage(currentUserId.value, to, text, timestamp, tempId)
    socket.value.emit('send-message', {
      to: recipientId,
      message,
    });
  };

  const fetchHistory = (recipientId, conversationId = null) => {
    if (!socket.value) return
    socket.value.emit('fetch-history', {
      participants: [authStore.me?._id, recipientId],
      conversationId,
    });

  }

  const sendTyping = (to: string, isTyping: boolean) => {
    socket.value?.emit('typing', { to, isTyping })
  }

  return { socket, onlineUsers, messages, connect, disconnect, send, sendTyping, fetchHistory, getMessages };
});
