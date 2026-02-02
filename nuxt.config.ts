export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
      head: {
          title: 'Furitech',
          link: [
              { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
          ]
      }
  },
    modules: ['@nuxtjs/i18n'],

    runtimeConfig: {
        public: {
            url: '',
            strapiUrl: process.env.NUXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
        },
    },
    i18n: {
        baseUrl: 'http://localhost:3000',
        defaultLocale: 'en',
        locales: [
            { code: 'en', name: 'English', file: 'en.json', language: 'en-US', isCatchallLocale: true },
            { code: 'fr', name: 'French',  file: 'fr.json', language: 'fr-FR' },
            { code: 'es', name: 'Spanish', file: 'es.json', language: 'es-ES' }
        ]
    }
})