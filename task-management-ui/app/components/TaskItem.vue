<template>
  <li
    class="flex items-center gap-2 border border-gray-200 rounded-lg py-2 px-4 hover:bg-gray-100 group"
  >
    <button
      @click="handleToggle"
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
    <div
      @click="handleEditMode"
      :class="['flex-1 text-sm', props.done ? 'line-through' : '']"
    >
      <p v-if="!editMode">{{ props.description }}</p>
      <input
        v-else
        @blur="handleDescriptionUpdate"
        v-model="editableDescription"
        ref="inputRef"
        type="text"
        class="w-full p-1 border border-gray-300 rounded"
      />
    </div>
    <div class="flex justify-end">
      <button
        @click="attemptDelete(props.id)"
        class="opacity-0 group-hover:opacity-100"
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
import { useTaskStore } from "~/store/task.store";
import { ref } from "vue";

interface Props {
  id: number;
  done: boolean;
  description: string;
}

const props = defineProps<Props>();
const taskStore = useTaskStore();

const editMode = ref<boolean>(false);
const inputRef = ref<HTMLInputElement | null>(null);
const editableDescription = ref<string>(props.description);

const handleEditMode = async () => {
  if (!editMode.value) {
    editMode.value = true;

    // Wait until DOM updates so input exists
    await nextTick();
    inputRef.value?.focus();
  }
};

const emit = defineEmits(["toggle"]);
const handleToggle = () => {
  emit("toggle");
};

const handleDescriptionUpdate = async () => {
  await taskStore.updateTask(props.id, {
    description: editableDescription.value,
  });

  editMode.value = false;
};

const attemptDelete = async (id: number) => {
  const ans: boolean = confirm("Are you sure you want to delete this task?");

  if (ans) {
    try {
      await taskStore.deleteTask(id);
    } catch (error) {}
  }
};
</script>
