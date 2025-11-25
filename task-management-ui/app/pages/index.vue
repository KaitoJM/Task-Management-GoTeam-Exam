<template>
  <EmptyTask></EmptyTask>
</template>

<script setup lang="ts">
import EmptyTask from "~/components/EmptyTask.vue";

definePageMeta({
  layout: "main-layout",
  middleware: "auth",
});
</script>
