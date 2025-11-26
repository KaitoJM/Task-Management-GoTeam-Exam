<template>
  <div class="flex items-center justify-center min-h-[100vh]">
    <div class="w-[350px] flex flex-col gap-4 items-center">
      <img src="~/assets/images/logo.png" class="w-40" />
      <div
        class="border border-gray-200 px-10 py-8 w-full rounded-lg flex flex-col gap-4"
      >
        <div class="flex flex-col gap-1 items-center">
          <h1 class="font-bold text-2xl">Sigin In</h1>
          <p class="text-xs text-gray-800">Login to continue using this app</p>
        </div>
        <form @submit.prevent="handleLogin" class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label for="" class="text-xs text-gray-800">Email</label>
            <input
              v-model="email"
              tabindex="1"
              type="text"
              class="border border-gray-200 px-4 py-1 w-full rounded-xl text-sm"
            />
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-xs text-gray-800 flex justify-between">
              <label for="">Password</label>
              <a href="#" tabindex="4">Forgot your password?</a>
            </div>
            <input
              v-model="password"
              tabindex="1"
              type="password"
              class="border border-gray-200 px-4 py-1 w-full rounded-xl text-sm"
            />
          </div>

          <!-- Errors -->
          <p v-if="errorMessage" class="text-xs text-red-500 mt-1">
            {{ errorMessage }}
          </p>

          <button
            :disabled="loading"
            tabindex="3"
            class="py-2 px-2 text-xs bg-black text-white rounded-xl mt-2 mb-8"
          >
            <span v-if="loading">Loading...</span>
            <span v-else>Login</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { User } from "~/types/user.type";
import type { ApiError } from "~/types/response.type";

interface LoginResponse {
  user: User;
  token: string;
}

const config = useRuntimeConfig();
const router = useRouter();

const email = ref<string>("");
const password = ref<string>("");
const loading = ref<boolean>(false);
const errorMessage = ref<string>("");

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const res: LoginResponse = await $fetch(`${config.public.apiBase}login`, {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    router.push("/");
  } catch (err) {
    const error = err as ApiError;

    if (error?.statusCode == 422) {
      errorMessage.value = error?.data?.message || "";
    }
  } finally {
    loading.value = false;
  }
};
</script>
