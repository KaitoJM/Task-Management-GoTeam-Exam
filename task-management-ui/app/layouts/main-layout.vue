<template>
  <div>
    <Header class="fixed top-0 left-0 w-full bg-white"></Header>
    <div class="p-4 flex-1 flex gap-4 pt-18 h-[100vh]">
      <div class="w-[300px] pr-[50px] h-full max-h-[100vh] overflow-y-auto">
        <TaskDateSelection></TaskDateSelection>
      </div>
      <div
        class="flex justify-center flex-1 h-full max-h-[100vh] overflow-y-auto"
      >
        <div class="w-[700px]">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
