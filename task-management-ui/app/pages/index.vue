<template>
  <EmptyTask></EmptyTask>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import EmptyTask from "~/components/EmptyTask.vue";
import { useTaskStore } from "~/store/task.store";

definePageMeta({
  layout: "main-layout",
  middleware: "auth",
});

const taskStore = useTaskStore();

onMounted(async () => {
  await taskStore.getTaskGroups();

  const today = new Date().toISOString().split("T")[0];
  if (today) {
    await taskStore.getTaskList(today);
  }
});
</script>
