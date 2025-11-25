<template>
  <div class="flex flex-col gap-4 text-sm">
    <div
      v-for="(group, indx) in taskStore.groupedByWeek"
      :key="`week-group-${indx}`"
    >
      <ul class="flex flex-col gap-1">
        <p
          v-if="group.weekLabel != 'active week'"
          class="text-xs text-gray-500 px-4"
        >
          {{ group.weekLabel }}
        </p>
        <li
          v-for="(date, dateIndx) in group.dates"
          :key="`week-date-${dateIndx}`"
        >
          <TaskDateItem :taskDate="date.date">{{ date.label }}</TaskDateItem>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import TaskDateItem from "./TaskDateItem.vue";
import { useTaskStore } from "~/store/task.store";

const taskStore = useTaskStore();
</script>
