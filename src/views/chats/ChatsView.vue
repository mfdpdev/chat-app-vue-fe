<script setup lang="ts">
import api from "@/plugins/axios"
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useAuthStore } from '@/stores/auth';
import { useSocketStore } from '@/stores/socket';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DropdownMenuCheckboxItemProps } from "reka-ui"

import { Search, MoreHorizontal } from 'lucide-vue-next'
import { ref, computed, onMounted, watch } from 'vue'

import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const socketStore = useSocketStore();
const router = useRouter();

// === DATA USER ===
const users = ref([
  //{ id: 1, name: 'Alice', avatar: '/avatars/alice.jpg', online: true },
  //{ id: 2, name: 'Bob', avatar: '/avatars/bob.jpg', online: false },
  //{ id: 3, name: 'Charlie', avatar: '/avatars/charlie.jpg', online: true },
  //{ id: 4, name: 'Diana', avatar: '/avatars/diana.jpg', online: false },
  //{ id: 5, name: 'Eve', avatar: '/avatars/eve.jpg', online: true },
  //{ id: 6, name: 'Frank', avatar: '/avatars/frank.jpg', online: true },
  //{ id: 7, name: 'Grace', avatar: '/avatars/grace.jpg', online: false },
  //{ id: 8, name: 'Nur', avatar: '/avatars/nur.jpg', online: false },
])

// === DATA LAST CHAT ===
const chats = ref([
  { id: 1, lastMessage: 'Oke, jam 3 ya?', time: '14:30', unread: 2 },
  { id: 2, lastMessage: 'Haha iya betul!', time: '13:15', unread: 0 },
  { id: 3, lastMessage: 'File sudah dikirim', time: '12:45', unread: 5 },
  { id: 4, lastMessage: 'Bisa bantu revisi?', time: '11:20', unread: 1 },
  { id: 5, lastMessage: 'Oke, nanti aku kabari', time: '10:05', unread: 0 },
  { id: 6, lastMessage: 'Meeting jam 4?', time: '09:30', unread: 3 },
  { id: 7, lastMessage: 'Sudah selesai', time: '08:15', unread: 0 },
])

// === SEARCH ===
const searchQuery = ref('')
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter(u =>
    u.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Ke halaman chat
const openChat = (_id: string) => {
  router.push(`/chats/${_id}`)
}

const handleProfile = () => {
  router.push("/users/profile")
}

const handleLogout = async () => {
  try {
    await authStore.logout();
  } catch (err) {}
};

const fetchUsers = async () => {
  try {
    const res = await api.get("/users", { withCredentials: true });

    const rawUsers = res.data?.data?.users || [];
    const filtered = rawUsers.filter(u => u._id !== authStore.me._id);

    users.value = filtered.map(user => ({
      ...user,
      online: socketStore.onlineUsers.includes(user._id),
    }));
  } catch (err) { }
}

watch(() => socketStore.onlineUsers, (onlineUsers) => {

  const onlineList = Array.isArray(onlineUsers) ? onlineUsers : []

  users.value = users.value.map( user => ({
    ...user,
    online: onlineList.includes(user._id)
  }));
})

onMounted(() => {
  fetchUsers();
})

</script>

<template>
  <div class="shadow flex flex-col h-dvh bg-gray-50 max-w-[500px] mx-auto">
    <!-- HEADER + SEARCH -->
    <header class="bg-white border-b px-4 py-3 space-y-3">
      <div class="p-2 flex justify-between items-center">
        <h1 class="text-2xl font-semibold">Messages</h1>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <div class="group">
              <div class="relative cursor-pointer">
                <Avatar class="h-14 w-14 ring-2 ring-transparent group-hover:ring-blue-500 transition-all">
                  <!-- <AvatarImage src="" /> -->
                  <AvatarImage :src="authStore.me.profileImageUrl || 'http://localhost:8000/images/default-profile.jpeg'" alt="John Doe" />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-fit mr-10">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                @click="handleProfile"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
                @click="handleLogout"
            >
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- Searchbar -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          v-model="searchQuery"
          placeholder="Cari kontak..."
          class="pl-10 h-10"
        />
      </div>
    </header>

    <!-- USER ROW (HORIZONTAL SCROLL) -->
    <div class="bg-white border-b">
      <ScrollArea class="whitespace-nowrap">
        <div class="flex gap-4 p-4">
          <div
            v-for="user in users"
            :key="user.id"
            @click="openChat(user._id)"
            class="flex flex-col items-center gap-1 cursor-pointer group min-w-fit"
          >
            <div class="relative">
              <Avatar class="h-14 w-14 ring-2 ring-transparent group-hover:ring-blue-500 transition-all">
                <AvatarImage :src="user.profileImageUrl || 'http://localhost:8000/images/default-profile.jpeg'" alt="John Doe" />
                <AvatarFallback>{{ user.name[0] }}</AvatarFallback>
              </Avatar>
              <!-- Online Indicator -->
              <div
                :class="[
                  'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white',
                  user.online ? 'bg-green-500' : 'bg-gray-400'
                ]"
              />
            </div>
            <p class="text-xs font-medium truncate max-w-16">{{ user.name }}</p>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>

    <Separator />

    <!-- LAST CHAT LIST (VERTIKAL) -->
    <ScrollArea class="flex-1">
      <div class="divide-y">
        <div
          v-for="chat in chats"
          :key="chat.id"
          @click="openChat(chat.id)"
          class="flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <!-- Avatar dari users -->
          <div class="relative">
            <Avatar>
              <!-- <AvatarImage :src="users.find(u => u.id === chat.id)?.avatar" /> -->
              <AvatarFallback>{{ users.find(u => u.id === chat.id)?.name[0] }}</AvatarFallback>
            </Avatar>
            <div
              :class="[
                'absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white',
                users.find(u => u.id === chat.id)?.online ? 'bg-green-500' : 'bg-gray-400'
              ]"
            />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex flex-col justify-center">
              <p class="font-medium text-sm truncate">
                {{ users.find(u => u.id === chat.id)?.name }}
              </p>
              <p class="text-sm text-gray-600 truncate">{{ chat.lastMessage }}</p>
            </div>
          </div>

          <span class="text-xs text-gray-500">{{ chat.time }}</span>

          <!-- Unread Badge -->
          <Badge v-if="chat.unread > 0" variant="default" class="text-xs">
            {{ chat.unread }}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
            <Button
                @click.stop
                variant="ghost"
                size="icon"
                class="h-8 w-8 cursor-pointer"
              >
                <MoreHorizontal class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-fit mr-20">
              <DropdownMenuItem
                  @click="() => console.log('hello')"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                  @click="handleLogout"
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
