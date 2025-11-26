<template>
  <div>
    <ul ref="list">
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Sortable from "sortablejs";

interface Item {
  id: number;
  name: string;
}

const items = ref<Item[]>([
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
]);

const list = ref<HTMLUListElement | null>(null);

onMounted(() => {
  if (list.value) {
    Sortable.create(list.value, {
      animation: 150,
      onEnd: (event) => {
        console.log("Moved item", event);
      },
    });
  }
});
</script>
