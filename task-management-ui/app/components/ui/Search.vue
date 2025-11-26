<template>
  <div
    class="border border-gray-200 px-2 py-2 w-full rounded-xl text-sm max-w-[400px] flex gap-2 items-center"
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
      class="lucide lucide-search-icon lucide-search size-5 text-gray-200"
    >
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
    <input
      @keyup="handleSearch"
      type="text"
      class="flex-1 outline-none"
      placeholder="Search"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTaskStore } from "~/store/task.store";

const taskStore = useTaskStore();
let debounceTimer: any = null;

const handleSearch = (event: KeyboardEvent) => {
  const value = (event.target as HTMLInputElement).value;

  // Reset timer every keyup
  clearTimeout(debounceTimer);

  // Wait one second before executing the search
  debounceTimer = setTimeout(() => {
    runSearch(value);
  }, 1000);
};

const runSearch = async (text: string) => {
  await taskStore.searchTaskList(text);
};
</script>
