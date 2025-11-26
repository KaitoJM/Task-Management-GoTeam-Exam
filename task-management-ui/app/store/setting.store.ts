export const useSettingStore = defineStore("settingStore", () => {
  const openMobileNav = ref<boolean>(false);

  const updatedOpenNav = computed<boolean>(() => {
    return openMobileNav.value;
  });

  return {
    openMobileNav,
    updatedOpenNav,
  };
});
