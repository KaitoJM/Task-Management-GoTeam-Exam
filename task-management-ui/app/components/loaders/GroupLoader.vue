<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1" v-for="group in 2">
      <div class="bg-gray-200 h-6 rounded-xl w-22"></div>
      <div class="bg-gray-200 h-8 rounded-xl" v-for="item in 6"></div>
    </div>
  </div>
</template>
