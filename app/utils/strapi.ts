import type { StrapiMedia } from '#shared/types/strapi-types'

/** todo: Должен быть strapiUrl, но из-за сокрытия nginx на сервере пути до strapi, раздача происходит с домена
 * потому в дев окружении работать не будет **/
export const getStrapiMedia = (media?: StrapiMedia | null): string => {
  const { siteUrl } = useRuntimeConfig()

  if (!media?.url) {
    return ''
  }

  return siteUrl + media.url
}
