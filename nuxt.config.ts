export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
      head: {
          title: 'Furitech',
          link: [
              { rel: 'icon', type: 'image/x-icon', href: '/fav.ico' },
          ]
      }
  },

  modules: ['@nuxtjs/i18n', '@nuxt/image'],

  runtimeConfig: {
      public: {
          backend: process.env.NUXT_PUBLIC_STRAPI_URL,
      },
  },

  i18n: {
      baseUrl: process.env.NUXT_PUBLIC_SITE_URL,
      defaultLocale: 'en',
      locales: [
          { code: 'en', name: 'English', file: 'en.json', language: 'en-US', isCatchallLocale: true },
          { code: 'fr', name: 'French',  file: 'fr.json', language: 'fr-FR' },
          { code: 'es', name: 'Spanish', file: 'es.json', language: 'es-ES' }
      ]
  }
})