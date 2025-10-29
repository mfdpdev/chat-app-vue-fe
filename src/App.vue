<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <!-- <nav class="fixed bg-white left-0 right-0 p-4 space-x-6"> -->
      <!--   <RouterLink to="/">Home</RouterLink> -->
      <!--   <RouterLink to="/about">About</RouterLink> -->
      <!--   <RouterLink to="/auth/signin">Sign In</RouterLink> -->
      <!--   <RouterLink to="/auth/signup">Sign Up</RouterLink> -->
      <!-- </nav> -->
    </div>

  </header>

  <main class="h-dvh pt-14">
    <RouterView />
  </main>
</template>

<style scoped>
</style>
