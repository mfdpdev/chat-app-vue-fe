<script lang="ts">
export const description = "A simple login form."
</script>

<script setup lang="ts">
import RegisterForm from "./../../components/RegisterForm.vue"
</script>

<template>
  <div class="flex h-full w-full items-center justify-center">
    <div class="w-3/4 sm:w-2/4 md:w-1/3 lg:max-w-[400px]">
      <RegisterForm />
    </div>
  </div>
</template>

