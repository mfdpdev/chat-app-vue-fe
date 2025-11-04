<script setup lang="ts">
import type { HTMLAttributes } from "vue"
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
import { ref } from "vue"
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore();
const router = useRouter();

const name = ref("")
const email = ref("")
const password = ref("")

const submit = async () => {
  const result = await auth.register({
    name: name.value,
    email: email.value,
    password: password.value,
  });

  if(result){
    router.push("/auth/login");
  }

  name.value = ""
  email.value = ""
  password.value = ""

}

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div :class="cn('flex flex-col gap-6 w-full', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="submit">
          <div class="flex flex-col gap-6">
            <div class="grid gap-2">
              <Label for="first-name">Name</Label>
              <Input id="Name" v-model="name" placeholder="John Doe" required />
            </div>
            <div class="grid gap-3">
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                v-model="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div class="grid gap-3">
              <div class="flex items-center">
                <Label for="password">Password</Label>
              </div>
              <Input id="password" v-model="password" type="password" required />
            </div>
            <div class="flex flex-col gap-3">
              <Button type="submit" class="w-full">
                Create an account
              </Button>
            </div>
          </div>
          <div class="mt-4 text-center text-sm">
            Already have an account?
            <router-link to="/auth/login" class="underline underline-offset-4">
              Login
            </router-link>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
