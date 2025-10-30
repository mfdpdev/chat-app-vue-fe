<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <!-- <div class="wrapper"> -->
    <!--   <nav class="fixed bg-white left-0 right-0 p-4 space-x-6"> -->
    <!--     <RouterLink to="/">Home</RouterLink> -->
    <!--     <RouterLink to="/about">About</RouterLink> -->
    <!--     <RouterLink to="/auth/login">Sign In</RouterLink> -->
    <!--     <RouterLink to="/auth/register">Sign Up</RouterLink> -->
    <!--   </nav> -->
    <!-- </div> -->

  </header>

  <main class="h-dvh bg-slate-50">
    <RouterView />
  </main>
</template>

<style scoped>
</style>
