export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true,
    typeCheck: true,
  },
  devServer: {
    host: '127.0.0.1',
    port: 3000,
  },
  app: {
    head: {
      title: 'Furitech',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/fav.ico' },
        {
          rel: 'preload',
          href: '/fonts/Montserrat-Bold.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/ArchivoBlack-Regular.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
      ],
    },
  },

  modules: ['@nuxtjs/i18n', '@nuxt/image', '@nuxt/eslint', '@nuxtjs/sitemap'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  vite: {
    server: {
      proxy: {
        '/uploads': {
          target: process.env.STRAPI_URL || '',
          changeOrigin: true,
        },
        '/api': {
          target: process.env.STRAPI_URL || '',
          changeOrigin: true,
        },
      },
    },
  },
  nitro: {
    prerender: {
      routes: ['/', '/fr', '/es'],
    },
  },

  runtimeConfig: {
    strapiUrl: process.env.STRAPI_URL || '',
    strapiToken: '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      strapiEnabled: Boolean(process.env.STRAPI_URL && process.env.STRAPI_TOKEN),
      googleSiteVerification: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL,
    name: 'Furitech',
  },

  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL,
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
        language: 'en-US',
        isCatchallLocale: true,
      },
      { code: 'fr', name: 'French', file: 'fr.json', language: 'fr-FR' },
      { code: 'es', name: 'Spanish', file: 'es.json', language: 'es-ES' },
    ],
    detectBrowserLanguage: false,
    strategy: 'prefix_except_default',
    langDir: '../i18n/locales',
    vueI18n: './i18n.config.ts',
  },
  sitemap: {
    autoI18n: true,
    xsl: false,
    credits: false,
    sitemapName: 'sitemap.xml',
  },
})
