<template>
  <NuxtLink
    :to="`/tasks?date=${taskDate}`"
    :class="[
      'py-1 px-4 rounded-xl w-full flex text-sm h-8 items-center hover:bg-gray-100 hover:text-black',
      activeClass,
    ]"
  >
    <slot></slot>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTaskStore } from "~/store/task.store";

const taskStore = useTaskStore();

interface Props {
  taskDate: string;
}

const props = defineProps<Props>();

const active = computed<boolean>(() => {
  return props.taskDate == taskStore.updatedActiveTaskGroup;
});

const activeClass = computed(() => {
  if (active.value) {
    return "bg-black text-white";
  }

  return "";
});
</script>
