<template>
  <TaskList></TaskList>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import TaskList from "~/components/TaskList.vue";
import EmptyTask from "~/components/EmptyTask.vue";
import { useTaskStore } from "~/store/task.store";
import { useRoute } from "vue-router";

definePageMeta({
  layout: "main-layout",
  middleware: "auth",
});

const taskStore = useTaskStore();
const route = useRoute();

watch(
  () => route.query,
  async (newQuery, oldQuery) => {
    console.log("Query changed:", newQuery, oldQuery);

    if (route.query.date) {
      await taskStore.getTaskList(route.query.date.toString(), true);
    }
  },
  { immediate: true, deep: true }
);

onMounted(async () => {
  if (!taskStore.dateGroups.length) {
    await taskStore.getTaskGroups();
  }

  if (route.query?.date) {
    await taskStore.getTaskList(route.query.date.toString());
  }
});
</script>
