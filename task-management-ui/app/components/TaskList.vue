<template>
  <div class="relative h-full">
    <div class="pb-[50px]">
      <ul class="flex flex-col gap-2">
        <TaskItem
          v-for="task in tasks"
          :key="task.id"
          :done="task.done"
          @toggle="toggleTask(task.id)"
        >
          {{ task.description }}
        </TaskItem>
      </ul>
    </div>
    <div
      class="absolute bottom-0 left-0 w-full p-4 bg-white flex gap-4 items-center h-[50px]"
    >
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
          class="w-[25px] h-[25px] rounded-full bg-black text-white absolute bottom-[6px] right-2 flex items-center justify-center"
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
import { computed, ref } from "vue";
import type { Task } from "~/types/task.type";
import { useRouter } from "vue-router";

const taskStore = useTaskStore();
const router = useRouter();

const tasks = computed<Task[]>(() => taskStore.activeCollection);

const newTask = ref<string>("");
const taskCreationError = ref<string>("");

const toggleTask = (id: number) => {
  const task = tasks.value.find((t) => t.id === id);
  if (task) {
    task.done = !task.done;
  }
};

const createTask = async () => {
  const today = new Date().toISOString().split("T")[0];

  try {
    const taskCreationReponse: Task | undefined = await taskStore.createNewTask(
      newTask.value
    );

    if (taskCreationReponse) {
      console.log("taskCreationReponse", taskCreationReponse);

      // if you are not in the current date page, redirect to the current date page to see the updates list
      // else refetch the task list to update it
      if (taskStore.updatedActiveTaskGroup != today) {
        router.push(`/tasks?date=${today}`);
      } else {
        taskStore.getTaskList(taskStore.updatedActiveTaskGroup);
      }

      // clear the new task value
      newTask.value = "";
    }
  } catch (error) {
    // taskCreationError.value = error?.message;
  }
};
</script>
