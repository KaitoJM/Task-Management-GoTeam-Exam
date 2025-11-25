export default defineNuxtRouteMiddleware((to, from) => {
  const publicPages = ["/login"];
  const token = localStorage.getItem("token");

  if (!token && !publicPages.includes(to.path)) {
    // Not logged in and trying to access private page
    return navigateTo("/login");
  }

  //   if (token && publicPages.includes(to.path)) {
  //     // Logged in user trying to access login/register
  //     return navigateTo("/dashboard");
  //   }
});
