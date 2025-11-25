<template>
  <li
    class="flex items-center gap-2 border border-gray-200 rounded-lg py-2 px-4 hover:bg-gray-100 group"
  >
    <button
      :class="[
        'flex items-center justify-center w-[20px] h-[20px] rounded-full border border-gray-200',
        props.done ? 'bg-black text-white' : 'bg-white text-black',
      ]"
    >
      <svg
        v-if="props.done"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-check-icon lucide-check size-4"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </button>
    <p :class="['flex-1 text-sm', props.done ? 'line-through' : '']">
      <slot></slot>
    </p>
    <div class="flex justify-end">
      <button class="opacity-0 group-hover:opacity-100">
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
          class="lucide lucide-trash2-icon lucide-trash-2 size-5 text-gray-400"
        >
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  </li>
</template>

<script setup lang="ts">
interface Props {
  done: boolean;
}

const props = defineProps<Props>();
</script>
