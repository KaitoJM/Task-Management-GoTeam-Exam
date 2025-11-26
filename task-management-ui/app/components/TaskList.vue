<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 max-h-full overflow-auto px-4 relative">
      <TasksLoader v-show="taskStore.updatedTasksLoading"></TasksLoader>
      <ul
        v-show="!taskStore.updatedTasksLoading"
        class="flex flex-col gap-2"
        ref="list"
      >
        <TaskItem
          v-for="task in tasks"
          :key="task.id"
          :id="task.id"
          :done="task.done"
          :description="task.description"
          @toggle="toggleTask(task.id)"
        >
        </TaskItem>
      </ul>
    </div>
    <div class="w-full p-4 bg-white flex gap-4 items-center h-[70px]">
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
import type { StoreActionResponse } from "~/types/response.type";
import Sortable from "sortablejs";
import TasksLoader from "./loaders/TasksLoader.vue";

const taskStore = useTaskStore();
const router = useRouter();

let sortablePlugin: Sortable | null;

const tasks = computed<Task[]>(() => taskStore.activeCollection);
const newTask = ref<string>("");
const taskCreationError = ref<string>("");
const list = ref<HTMLUListElement | null>(null);

const applySortable = () => {
  if (list.value) {
    sortablePlugin = Sortable.create(list.value, {
      animation: 150,
      onEnd: async (event: any) => {
        console.log("Moved item", event);

        const movedItem: Task | null =
          tasks.value.splice(event.oldIndex!, 1)[0] || null; // remove item from old position
        if (movedItem) {
          tasks.value.splice(event.newIndex!, 0, movedItem); // insert at new position
        }

        const newOrder: number[] = tasks.value.map((item) => item.id);
        console.log("newOrder", newOrder);

        // Call API to persist new order
        await updateTaskOrder(newOrder);
      },
    });
  }
};

const removeSortable = () => {
  if (sortablePlugin) {
    sortablePlugin.destroy();
    sortablePlugin = null;
  }
};

onMounted(() => {
  applySortable();
});

watch(
  () => taskStore.sortable,
  async (newValue, oldValue) => {
    if (newValue) {
      applySortable();
    } else {
      removeSortable();
    }
  },
  { immediate: true, deep: true }
);

const toggleTask = async (id: number) => {
  const task = tasks.value.find((t) => t.id === id);
  if (task) {
    task.done = !task.done;
    await updateTaskStatus(task, task.done);
  }
};

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

const updateTaskStatus = async (task: Task, status: boolean) => {
  try {
    await taskStore.updateTask(task.id, { done: status });
  } catch (error) {
    // taskCreationError.value = error?.message;
  }
};

const updateTaskOrder = async (newOrder: number[]) => {
  await taskStore.sortTask(newOrder);
};
</script>
