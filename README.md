# Mid-Level Full Stack Developer Technical Exam
By: John Mark Mancol

Thank you for giving me the opportunity to take on this challenge. This assessment was designed to evaluate proficiency in building web applications using **Laravel** and developing API-driven systems, while following best practices and Laravel-specific conventions.  

- Backend: Laravel v12 - task-management-api
- Frontend: NuxtJS v4 - task-management-ui

For the Laravel backend, I implemented Laravel Sail as the primary development environment. Additionally, I configured SQLite as an alternative option for local development. Both environment setups are available in the project’s root directory for your convenience.
 - Laravel Sail - .env.example
 - Sqlite Setup (traditional) - .env.sqlite
 - Pest Testing - .env.testing


### Authentication
Note: I used Sanctum’s API token authentication instead of the session-based approach. Because of this, the use of an authentication token is essential for all communication between the UI and the API.

### Nuxt
If the laravel API somehow has different host than mine, feel free to modify the nuxt.config.js

```
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      apiBase: "http://127.0.0.1:8000/api/", // API base URL
    },
  },

  modules: ["@pinia/nuxt"],
});
```
