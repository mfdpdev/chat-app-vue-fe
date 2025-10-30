<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { ref } from "vue"
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const auth = useAuthStore();
const router = useRouter();

const email = ref('')
const password = ref('')

const submit = async () => {
  await auth.login({
    email: email.value,
    password: password.value,
  });

  router.push("/chats")
}

</script>

<template>
  <div :class="cn('flex flex-col gap-6 w-full', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="submit">
          <div class="flex flex-col gap-6">
            <div class="grid gap-3">
              <Label for="email">Email</Label>
              <Input
                v-model="email"
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div class="grid gap-3">
              <div class="flex items-center">
                <Label for="password">Password</Label>
              </div>
              <Input v-model="password" id="password" type="password" required />
            </div>
            <div class="flex flex-col gap-3">
              <Button type="submit" class="w-full">
                Login
              </Button>
            </div>
          </div>
          <div class="mt-4 text-center text-sm">
            Don't have an account?
            <router-link class="underline underline-offset-4" to="/auth/register">Register</router-link>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
