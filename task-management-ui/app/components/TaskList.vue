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
      <CreateTaskForm></CreateTaskForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/store/task.store";
import { computed, ref } from "vue";
import type { Task } from "~/types/task.type";
import Sortable from "sortablejs";
import TasksLoader from "./loaders/TasksLoader.vue";
import CreateTaskForm from "./CreateTaskForm.vue";

const taskStore = useTaskStore();

let sortablePlugin: Sortable | null;

const tasks = computed<Task[]>(() => taskStore.activeCollection);
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
