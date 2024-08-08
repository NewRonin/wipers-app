// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      title: "WIPERS",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  css: ["@/assets/styles/main.scss", "@/assets/styles/colors.scss"],

  modules: [
    '@pinia/nuxt',
  ],
})
