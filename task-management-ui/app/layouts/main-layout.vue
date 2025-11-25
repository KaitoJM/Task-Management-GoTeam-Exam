<template>
  <div class="flex flex-col min-h-[100vh]">
    <Header></Header>
    <div class="p-4 flex-1 flex gap-4">
      <div class="w-[300px] pr-[50px] h-full max-h-full overflow-y-auto">
        <TaskDateSelection></TaskDateSelection>
      </div>
      <div class="flex justify-center flex-1">
        <div class="w-[700px]">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
