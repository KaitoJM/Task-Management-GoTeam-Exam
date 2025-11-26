<template>
  <div
    class="flex gap-4 py-2 px-4 border-b border-gray-200 h-[60px] items-center justify-between"
  >
    <div class="w-80">
      <img src="~/assets/images/logo.png" alt="logo" class="h-8" />
    </div>
    <Search></Search>
    <div class="w-80 flex justify-end">
      <AccountBtn></AccountBtn>
    </div>
  </div>
</template>

<script setup lang="ts">
import AccountBtn from "./ui/AccountBtn.vue";
import Search from "./ui/Search.vue";
</script>
