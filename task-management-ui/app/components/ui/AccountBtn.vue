<template>
  <div class="relative">
    <button
      @click="showAccountInfo = !showAccountInfo"
      class="flex items-center justify-center p-2 rounded-full bg-gray-500 w-fit cursor-pointer"
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
        class="lucide lucide-user-round-icon lucide-user-round size-4 text-white"
      >
        <circle cx="12" cy="8" r="5" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </svg>
    </button>
    <div
      v-if="showAccountInfo"
      class="z-20 w-60 p-4 bg-white rounded-lg absolute border border-gray-200 right-0 top-[40px] shadow-md flex flex-col gap-4"
    >
      <div class="flex flex-col items-center gap-2">
        <div
          class="flex items-center justify-center p-2 rounded-full bg-gray-500 w-fit"
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
            class="lucide lucide-user-round-icon lucide-user-round size-12 text-white"
          >
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
        </div>
        <div class="flex flex-col items-center justify-center p-1">
          <p class="font-semibold text-gray-400">{{ userName }}</p>
          <p class="text-gray-500 text-xs">{{ userEmail }}</p>
        </div>
      </div>
      <div class="pt-4 border-t border-gray-200">
        <button
          @click="logout"
          class="w-full bg-black text-white text-xs p-2 rounded-lg cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserInfo } from "@/types/user.type";
import { log } from "console";
import type { ApiError } from "~/types/response.type";

const config = useRuntimeConfig();
const userJson: string | null = localStorage.getItem("user");
let user: UserInfo = {};
const token = localStorage.getItem("token");

const userName = ref<string>("");
const userEmail = ref<string>("");
const showAccountInfo = ref<boolean>(false);

onMounted(() => {
  if (userJson) {
    user = JSON.parse(userJson);
    userName.value = user?.name || "";
    userEmail.value = user?.email || "";
  }
});

const logout = async () => {
  const ans: boolean = confirm("Are you sure you want to logout?");

  if (ans) {
    try {
      const res = await $fetch(`${config.public.apiBase}logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      location.reload();
    } catch (err) {
      const error = err as ApiError;
      console.error(`Error logging out: ${error}`);
    }
  }
};
</script>
