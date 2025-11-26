<template>
  <div class="h-full flex items-center justify-center w-full">
    <div class="flex flex-col items-center w-full gap-4">
      <p class="font-bold text-2xl">What do you have in mind?</p>
      <form
        @submit.prevent="createTask"
        class="w-full border border-gray-200 p-4 rounded-xl text-sm relative"
      >
        <textarea
          v-model="newTask"
          class="w-full outline-none"
          rows="5"
          id=""
          placeholder="Write the task you plan to do today here..."
        ></textarea>
        <button
          class="w-[35px] h-[35px] rounded-full bg-black text-white absolute bottom-2 right-2 flex items-center justify-center"
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
            class="lucide lucide-arrow-up-icon lucide-arrow-up size-5"
          >
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/store/task.store";
import { useRouter } from "vue-router";
import { ref } from "vue";
import type { Task } from "~/types/task.type";
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
      // router.push(`/tasks?date=${today}`);
      newTask.value = "";
    }
  } catch (error) {
    // taskCreationError.value = error?.message;
  }
};
</script>
