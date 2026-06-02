import type { FooterType, ErrorPageType } from '#shared/types/strapi-types'
import { createStrapiApi } from '~/utils/strapi-client'

export const useStrapi = () => {
  if (import.meta.client) {
    const error = async () => {
      throw new Error('Strapi fetchers are server-only')
    }

    return {
      getFooter: error,
      getErrorPage: error,
      getHomePage: error,
    }
  }

  const { strapiUrl, strapiToken } = useRuntimeConfig()
  const api = createStrapiApi({ baseUrl: strapiUrl, token: strapiToken })

  const getFooter = async (locale?: string): Promise<FooterType> => {
    const response = await api.getFooter(locale)
    return response.data
  }

  const getErrorPage = async (locale?: string): Promise<ErrorPageType> => {
    const response = await api.getErrorPage(locale)
    return response.data
  }

  const getHomePage = async (locale?: string): Promise<HomePageType> => {
    const response = await api.getHomePage(locale)
    return response.data
  }

  return {
    getFooter,
    getErrorPage,
    getHomePage,
  }
}
