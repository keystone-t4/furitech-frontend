import type { StrapiMedia } from '#shared/types/strapi-types'

export const getStrapiMedia = (media?: StrapiMedia | null): string => {
  const { strapiUrl } = useRuntimeConfig()

  if (!media?.url) {
    return ''
  }

  return strapiUrl + media.url
}
