export type StrapiId = number

export interface StrapiMeta {
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
  locale?: string
}

export interface StrapiMediaFormat {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path?: string | null
  size: number
  width?: number | null
  height?: number | null
}

export interface StrapiMedia extends StrapiMeta {
  id: StrapiId
  name: string
  alternativeText?: string | null
  caption?: string | null
  width?: number | null
  height?: number | null
  formats?: Record<string, StrapiMediaFormat> | null
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl?: string | null
  provider?: string | null
  provider_metadata?: Record<string, unknown> | null
}

export interface StrapiCollectionResponse<T> {
  data: T[]
}

export interface StrapiSingleResponse<T> {
  data: T
}

export type BlockTextContent = {
  __component: 'blocks.text-content'
  id: StrapiId
  title: string
  text_content: string
  image: StrapiMedia | null
  image_mobile: StrapiMedia | null
}

export type BlockInnerItem = {
  id: StrapiId
  title: string
  text_content: string
  image: StrapiMedia | null
  image_mobile: StrapiMedia | null
}

export type BlockImageListContent = {
  __component: 'blocks.image-list-content'
  id: StrapiId
  title: string
  items: BlockInnerItem[]
}

export type BlockMapContent = {
  __component: 'blocks.map-content'
  id: StrapiId
  title: string
  text_content: string
  map_url: string
}

export type HomePageBlock = BlockTextContent | BlockImageListContent | BlockMapContent

export type StrapiSeo = {
  meta_title?: string | null
  meta_description?: string | null
  og_title?: string | null
  og_description?: string | null
  og_image?: StrapiMedia | null
  json_ld?: {
    '@context'?: string | string[]
    '@type': string
    [key: string]: unknown
  } | null
}

export interface FooterType extends StrapiMeta {
  id: StrapiId
  copyright: string
}

export interface ErrorPageType extends StrapiMeta {
  id: StrapiId
  page_not_found_text: string | null
  main_page_button_text: string | null
}

export interface HomePageType extends StrapiMeta {
  id: StrapiId
  title: string | null
  sub_title: string | null
  hero_image: StrapiMedia | null
  hero_image_mobile: StrapiMedia | null
  block: HomePageBlock[] | null
  seo: StrapiSeo | null
}
