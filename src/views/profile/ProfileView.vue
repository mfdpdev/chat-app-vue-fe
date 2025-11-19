<template>
  <div class="flex flex-col h-dvh shadow max-w-[500px] bg-white mx-auto">

    <!-- Header dengan tombol kembali -->
    <header class="bg-white border-b px-4 py-3 flex items-center gap-3">
      <router-link to="/chats">
        <Button variant="outline" size="icon">
          <ChevronLeft class="w-4 h-4" />
        </Button>
      </router-link>
    </header>

    <!-- Main Content -->
    <form class="grow" @submit.prevent="handle">
      <main class="h-full px-4 py-3 flex flex-col space-y-6">
        <!-- Profile Card -->
        <Card>
          <CardContent class="pt-8">
            <!-- Foto Profile + Nama -->
            <div class="flex flex-col items-center">
              <Avatar class="h-32 w-32 ring-4 ring-secondary ring-offset-4 ring-offset-background">
                <AvatarImage :src="previewUrl || authStore.me.profileImageUrl || 'http://localhost:8000/images/default-profile.jpeg'" alt="John Doe" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <h2 class="mt-4 text-2xl font-semibold">{{ authStore.me?.name }}</h2>
            </div>

            <!-- Form Fields -->
            <div class="mt-8 space-y-6">
              <div class="space-y-2">
                <Label>Profile Picture</Label>
                <Input id="profileImageInput" type="file" accept="image/*" class="" @change="onFileChange" />
              </div>

              <div class="space-y-2">
                <Label>Your Name</Label>
                <Input v-model="form.name" type="text" placeholder="Type your name..." />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Change Password Card -->
        <Card class="flex-1">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="space-y-2">
              <Label>New Password</Label>
                <Input v-model="form.password" type="password" placeholder="••••••••" />
              </div>
              <div class="space-y-2">
                <Label>Confirm New Password</Label>
                <Input v-model="form.password_confirmation" type="password" placeholder="••••••••" />
              </div>
            </CardContent>
          </Card>

          <Button class="w-full" >Update Profile</Button>
        </main>
      </form>
    </div>
</template>

<script setup lang="ts">

// Semua komponen shadcn-vue
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, ArrowLeft } from "lucide-vue-next"
import { useUserStore } from "@/stores/user"
import { useAuthStore } from "@/stores/auth"
import { ref, reactive } from "vue"

// Fungsi kembali (bisa diganti dengan router kalau pakai Vue Router)
const goBack = () => {
  window.history.back()
  // atau kalau pakai Vue Router:
  // router.back()
  // atau router.push('/home')
}

const authStore = useAuthStore();
const userStore = useUserStore();

const form = reactive({
  name: authStore.me?.name ?? "",
  password: "",
  password_confirmation: "",
})

const validatePassword = () => {
  //passwordErrors.value = ''

  // Jika salah satu diisi, tapi tidak sama
  if (form.password && form.password !== form.password_confirmation) {
    //passwordErrors.value = 'Password dan konfirmasi password harus sama'
    return false
  }
  return true
}

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) {
    const file = input.files[0]
    selectedFile.value = file

    // Buat preview
    const reader = new FileReader()
    reader.onload = (ev) => {
      previewUrl.value = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handle = async () => {
  if(!validatePassword()){
    return;
  }
  
  const payload = new FormData();

  if(form.name && form.name !== authStore.me?.name) payload.append("name", form.name);
  if(form.password && form.password !== "") payload.append("password", form.password);

  if (selectedFile.value) {
    payload.append('profileImage', selectedFile.value)
  }

  await userStore.update(payload);

  const fileInput = document.getElementById('profileImageInput') as HTMLInputElement
  if (fileInput) fileInput.value = ''   // ini yang bikin input kosong

  // Reset state biar bersih
  selectedFile.value = null
  previewUrl.value = null

  form.password = "";
  form.password_confirmation = "";
}
</script>
