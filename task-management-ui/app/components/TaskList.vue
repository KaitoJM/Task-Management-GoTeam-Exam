<template>
  <div class="relative h-full">
    <div class="pb-[50px]">
      <ul class="flex flex-col gap-2">
        <TaskItem>
          I need to change the background color to white for the login page
        </TaskItem>
        <TaskItem>
          I need to change the background color to white for the login page
        </TaskItem>
        <TaskItem :done="true">
          I need to change the background color to white for the login page
        </TaskItem>
      </ul>
    </div>
    <div
      class="absolute bottom-0 left-0 w-full p-4 bg-white flex gap-4 items-center h-[50px]"
    >
      <form
        class="border border-gray-200 px-4 py-2 w-full rounded-xl text-sm relative"
      >
        <input
          type="text"
          placeholder="What else you need to do?"
          class="w-full outline-none"
        />
        <button
          class="w-[25px] h-[25px] rounded-full bg-black text-white absolute bottom-[6px] right-2 flex items-center justify-center"
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
            class="lucide lucide-arrow-up-icon lucide-arrow-up size-5"
          >
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>
