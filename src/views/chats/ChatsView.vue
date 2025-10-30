<script setup lang="ts">
import ItemAvatar from "./../../components/ItemAvatar.vue"
import Pagination from "./../../components/Pagination.vue"
</script>

<template>
  <div class="flex flex-col max-w-[500px] p-4 space-y-4 mx-auto h-full bg-white">
    <div class="grow flex flex-col justify-between">
      <div class="space-y-2">
        <h4 class="text-sm font-medium leading-none">
          Latest
        </h4>
        <div class="space-y-4">
          <ItemAvatar />
          <ItemAvatar />
        </div>
      </div>
      <Pagination />
    </div>
    <div class="grow flex flex-col justify-between">
      <div class="space-y-2">
        <h4 class="text-sm font-medium leading-none">
          Users
        </h4>
        <div class="space-y-4">
          <ItemAvatar />
          <ItemAvatar />
        </div>
      </div>
      <Pagination />
    </div>
  </div>
</template>
