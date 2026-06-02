import enContent from '~~/i18n/locales/content/en.json'
import frContent from '~~/i18n/locales/content/fr.json'
import esContent from '~~/i18n/locales/content/es.json'

import type { HomePageType, FooterType, ErrorPageType } from '#shared/types/strapi-types'

interface LocaleContent {
  home_page: HomePageType
  footer: FooterType
  error_page: ErrorPageType
}

const typedEnContent = enContent as LocaleContent
const typedFrContent = frContent as LocaleContent
const typedEsContent = esContent as LocaleContent

export function useLocaleContent() {
  const { locale } = useI18n()

  return computed<LocaleContent>(() => {
    if (locale.value === 'fr') return typedFrContent
    if (locale.value === 'es') return typedEsContent
    return typedEnContent
  })
}
