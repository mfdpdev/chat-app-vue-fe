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
    <main class="grow px-4 py-3 flex flex-col space-y-6">
      <!-- <div class="space-y-6 flex flex-col bg-red-200"> -->

        <!-- Profile Card -->
        <Card>
          <CardContent class="pt-8">
            <!-- Foto Profile + Nama -->
            <div class="flex flex-col items-center">
              <Avatar class="h-32 w-32 ring-4 ring-secondary ring-offset-4 ring-offset-background">
                <AvatarImage src="/images/default-profile.jpeg" alt="John Doe" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <h2 class="mt-4 text-2xl font-semibold">John Doe</h2>
            </div>

            <!-- Form Fields -->
            <div class="mt-8 space-y-6">
              <div class="space-y-2">
                <Label>Profile Picture</Label>
                <Input type="file" accept="image/*" disabled class="cursor-not-allowed" />
              </div>

              <div class="space-y-2">
                <Label>Your Name</Label>
                <Input value="John Doe" placeholder="Type your name..." disabled />
              </div>

              <Button class="w-full" >Update Profile</Button>
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
                <Input type="password" placeholder="••••••••" disabled />
              </div>
              <div class="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="••••••••" disabled />
              </div>
              <Button class="w-full" >Update Password</Button>
            </CardContent>
          </Card>

        <!-- </div> -->
      </main>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

// Semua komponen shadcn-vue
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft } from "lucide-vue-next"

// Fungsi kembali (bisa diganti dengan router kalau pakai Vue Router)
const goBack = () => {
  window.history.back()
  // atau kalau pakai Vue Router:
  // router.back()
  // atau router.push('/home')
}
</script>
