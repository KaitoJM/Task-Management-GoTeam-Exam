<script setup lang="ts">
import { computed } from "vue";

interface Props {
  taskDate: string;
  active?: boolean;
}

const props = defineProps<Props>();

const activeClass = computed(() => {
  if (props.active) {
    return "bg-black text-white";
  }

  return "";
});
</script>

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
