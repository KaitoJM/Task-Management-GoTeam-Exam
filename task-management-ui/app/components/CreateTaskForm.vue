<template>
  <form
    @submit.prevent="createTask"
    class="border border-gray-200 px-4 py-2 w-full rounded-xl text-sm relative"
  >
    <input
      v-model="newTask"
      type="text"
      placeholder="What else you need to do?"
      class="w-full outline-none"
    />
    <button
      :disabled="taskStore.updatedCreatingTasksLoading"
      class="w-[25px] h-[25px] rounded-full bg-black text-white absolute bottom-[6px] right-2 flex items-center justify-center"
    >
      <svg
        v-if="!taskStore.updatedCreatingTasksLoading"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-arrow-up-icon lucide-arrow-up size-5"
      >
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-loader-circle-icon lucide-loader-circle size-5 animate-spin"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </button>
  </form>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/store/task.store";
import type { StoreActionResponse } from "~/types/response.type";

const taskStore = useTaskStore();
const router = useRouter();

const newTask = ref<string>("");
const taskCreationError = ref<string>("");

const createTask = async () => {
  const today = new Date().toISOString().split("T")[0];

  try {
    const taskCreationReponse: StoreActionResponse =
      await taskStore.createNewTask(newTask.value);

    if (taskCreationReponse.success) {
      // if you are not in the current date page, redirect to the current date page to see the updates list
      if (taskStore.updatedActiveTaskGroup != today) {
        router.push(`/tasks?date=${today}`);
      }

      // clear the new task value
      newTask.value = "";
    }
  } catch (error) {
    // taskCreationError.value = error?.message;
  }
};
</script>
