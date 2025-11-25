<template>
  <TaskList></TaskList>
</template>

<script setup lang="ts">
import TaskList from "~/components/TaskList.vue";

definePageMeta({
  layout: "main-layout",
  middleware: "auth",
});
</script>
