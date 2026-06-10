import type { StrapiSeo } from '#shared/types/strapi-types'

const DEFAULT_TITLE = 'Furitech'
const DEFAULT_DESCRIPTION =
  'Global supplier of bitumen, agricultural products, and mineral fertilizers. Reliable logistics and tailored solutions.'

const localeToOg = (locale: string): string => {
  switch (locale) {
    case 'fr':
      return 'fr_FR'
    case 'es':
      return 'es_ES'
    default:
      return 'en_US'
  }
}

export const useSeo = (seo?: StrapiSeo | null): void => {
  const { locale } = useI18n()
  const runtimeConfig = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = runtimeConfig.public.siteUrl || 'https://furitechsl.com/'

  const metaTitle = seo?.meta_title ?? DEFAULT_TITLE
  const metaDescription = seo?.meta_description ?? DEFAULT_DESCRIPTION
  const ogImage = seo?.og_image ? seo.og_image.url : `${siteUrl.replace(/\/$/, '')}/og-img.png`
  const canonical = `${siteUrl.replace(/\/$/, '')}${route.path}`
  const jsonLdScript = seo?.json_ld
    ? [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(seo.json_ld),
          async: false,
        },
      ]
    : []

  const googleSiteVerification = runtimeConfig.public.googleSiteVerification as string

  const meta: Record<string, string>[] = [
    { name: 'description', content: metaDescription },
    { property: 'og:title', content: metaTitle },
    { property: 'og:description', content: metaDescription },
    { property: 'og:image', content: ogImage },
    { property: 'og:url', content: canonical },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: localeToOg(locale.value) },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: metaTitle },
    { name: 'twitter:description', content: metaDescription },
    { name: 'twitter:image', content: ogImage },
  ]

  if (googleSiteVerification) {
    meta.push({ name: 'google-site-verification', content: googleSiteVerification })
  }

  // Centralize all meta tags so every page can share the same SEO rules.
  useHead({
    title: metaTitle,
    htmlAttrs: {
      lang: locale.value,
    },
    meta,
    script: jsonLdScript,
    link: [{ rel: 'canonical', href: canonical }],
  })
}
