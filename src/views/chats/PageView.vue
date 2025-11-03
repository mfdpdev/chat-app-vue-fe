<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ref, watch, nextTick, onMounted } from 'vue'
import { ChevronLeft, Send } from "lucide-vue-next"

// Data chat
const data = ref({
  name: 'Alice',
  avatar: '/avatars/alice.jpg',
  messages: [
    { text: 'Hai, kamu sudah sampai?', time: '14:25', sender: 'other' },
    { text: 'Belum, masih di jalan', time: '14:26', sender: 'me' },
    { text: 'Oke, jam 3 ya?', time: '14:30', sender: 'other' },
  ],
})

// Input pesan
const input = ref('')
const scrollArea = ref(null)

// Fungsi kirim pesan
const sendMessage = () => {
  if (!input.value.trim()) return

  const now = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })

  data.value.messages.push({
    text: input.value,
    time: now,
    sender: 'me',
  })

  input.value = ''
}

// Scroll ke bawah setiap kali messages berubah
watch(
  () => data.value.messages,
  async () => {
    await nextTick()
    scrollToBottom()
  },
  { deep: true }
)

// Fungsi scroll manual
const scrollToBottom = () => {
  if (!scrollArea.value) return
  const viewport = scrollArea.value.$el.querySelector('[data-reka-scroll-area-viewport]')
  if (viewport) {
    viewport.scrollTop = viewport.scrollHeight
  }
}

// Scroll saat pertama kali load
onMounted(() => {
  nextTick(() => scrollToBottom())
})
</script>

<template>
  <div class="shadow flex flex-col mx-auto h-dvh bg-gray-50 max-w-[500px]">
    <!-- Header -->
    <header class="bg-white border-b px-4 py-3 flex items-center gap-3">
      <router-link to="/chats">
        <Button variant="outline" size="icon">
          <ChevronLeft class="w-4 h-4" />
        </Button>
      </router-link>
      <Avatar>
        <AvatarImage :src="data.avatar" />
        <AvatarFallback>{{ data.name[0] }}</AvatarFallback>
      </Avatar>
      <div>
        <p class="font-semibold text-sm">{{ data.name }}</p>
        <p class="text-xs text-gray-500">Online</p>
      </div>
    </header>

    <!-- Messages -->
    <ScrollArea ref="scrollArea" class="flex-1 p-4 h-0">
      <div class="space-y-4">
        <div
          v-for="(msg, index) in data.messages"
          :key="index"
          :class="['flex', msg.sender === 'me' ? 'justify-end' : 'justify-start']"
        >
          <div
            :class="[
              'max-w-xs px-4 py-2 rounded-2xl text-sm',
              msg.sender === 'me'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900',
            ]"
          >
            <p>{{ msg.text }}</p>
            <p
              :class="[
                'text-xs mt-1',
                msg.sender === 'me' ? 'text-blue-200' : 'text-gray-500',
              ]"
            >
              {{ msg.time }}
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>

    <Separator />

    <!-- Input -->
    <div class="bg-white p-4 flex gap-2">
      <Input
        v-model="input"
        placeholder="Ketik pesan..."
        @keydown.enter="sendMessage"
        class="flex-1"
      />
      <Button @click="sendMessage" size="icon">
        <Send class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
