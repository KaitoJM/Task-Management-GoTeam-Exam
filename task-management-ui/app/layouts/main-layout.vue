<template>
  <div>
    <Header class="fixed top-0 left-0 w-full bg-white z-20"></Header>
    <div class="flex-1 flex pt-[60px] h-[100vh]">
      <div
        :class="[
          'fixed top-0 sm:static flex flex-col gap-4 w-[300px] p-4 sm:pr-[50px] h-full max-h-[100vh] overflow-y-auto bg-white z-30 sm:z-10 shadow-md sm:shadow-none transition-all duration-300 ease-in-out',
          settingStore.updatedOpenNav ? 'left-0' : '-left-[300px]',
        ]"
      >
        <div class="sm:hidden flex items-center gap-4">
          <button
            @click="settingStore.openMobileNav = !settingStore.openMobileNav"
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
              class="lucide lucide-arrow-left-icon lucide-arrow-left size-5"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
          <Search></Search>
        </div>
        <TaskDateSelection></TaskDateSelection>
      </div>
      <div
        class="flex justify-center flex-1 h-full max-h-[100vh] overflow-y-auto"
      >
        <div class="w-full">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Search from "~/components/ui/Search.vue";
import { useSettingStore } from "~/store/setting.store";

const settingStore = useSettingStore();
</script>
