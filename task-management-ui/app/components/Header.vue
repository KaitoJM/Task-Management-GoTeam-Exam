<template>
  <div
    class="flex gap-4 py-2 px-4 border-b border-gray-200 h-[60px] items-center justify-between"
  >
    <div class="w-full sm:w-80 flex items-center gap-2">
      <button
        @click="handleNavToggle"
        class="p-2 flex items-center justify-center sm:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-menu-icon lucide-menu size-5"
        >
          <path d="M4 5h16" />
          <path d="M4 12h16" />
          <path d="M4 19h16" />
        </svg>
      </button>
      <img src="~/assets/images/logo.png" alt="logo" class="h-8" />
    </div>
    <Search class="hidden sm:flex"></Search>
    <div class="w-80 flex justify-end">
      <AccountBtn></AccountBtn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingStore } from "~/store/setting.store";
import AccountBtn from "./ui/AccountBtn.vue";
import Search from "./ui/Search.vue";

const settingStore = useSettingStore();

const handleNavToggle = () => {
  settingStore.openMobileNav = !settingStore.openMobileNav;
};
</script>
