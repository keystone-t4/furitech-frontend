import type {
  ErrorPageType,
  FooterType,
  HomePageType,
  StrapiSingleResponse,
} from '#shared/types/strapi-types'
import { createStrapiClient } from '~/utils/strapi-core'

export interface StrapiClientOptions {
  baseUrl: string
  token?: string
}

export const createStrapiApi = (options: StrapiClientOptions) => {
  const client = createStrapiClient(options)

  const getFooter = async (locale?: string): Promise<StrapiSingleResponse<FooterType>> => {
    return await client.get<StrapiSingleResponse<FooterType>>('/footer', {
      query: {
        ...(locale ? { locale } : {}),
        fields: ['copyright'],
      },
    })
  }

  const getErrorPage = async (locale?: string): Promise<StrapiSingleResponse<ErrorPageType>> => {
    return await client.get<StrapiSingleResponse<ErrorPageType>>('/error-page', {
      query: {
        ...(locale ? { locale } : {}),
        fields: ['page_not_found_text', 'main_page_button_text'],
      },
    })
  }

  //homepage без тире, потому что так сложилось исторически
  const getHomePage = async (locale?: string): Promise<StrapiSingleResponse<HomePageType>> => {
    return await client.get<StrapiSingleResponse<HomePageType>>('/homepage', {
      query: {
        ...(locale ? { locale } : {}),
        populate: {
          hero_image: true,
          seo: { populate: '*' },
          block: {
            on: {
              'blocks.image-list-content': {
                populate: {
                  items: {
                    populate: { image: true },
                  },
                },
              },
              'blocks.text-content': {
                populate: { image: true },
              },
              'blocks.map-content': true,
            },
          },
        },
      },
    })
  }

  return {
    getFooter,
    getErrorPage,
    getHomePage,
  }
}
