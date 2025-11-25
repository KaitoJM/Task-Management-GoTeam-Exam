<script setup lang="ts">
import { computed } from "vue";

interface Props {
  taskDate?: string;
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
    to="/#"
    :class="[
      'py-1 px-4 rounded-xl w-full flex text-sm h-8 items-center',
      activeClass,
    ]"
  >
    <slot></slot>
  </NuxtLink>
</template>
