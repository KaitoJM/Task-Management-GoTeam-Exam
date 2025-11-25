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
        <form class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label for="" class="text-xs text-gray-800">Email</label>
            <input
              type="text"
              class="border border-gray-200 px-4 py-1 w-full rounded-xl text-sm"
            />
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-xs text-gray-800 flex justify-between">
              <label for="">Password</label>
              <a href="#">Forgot your password?</a>
            </div>
            <input
              type="password"
              class="border border-gray-200 px-4 py-1 w-full rounded-xl text-sm"
            />
          </div>
          <button
            class="py-2 px-2 text-xs bg-black text-white rounded-xl mt-2 mb-8"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
