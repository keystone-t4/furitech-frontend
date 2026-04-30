export type StrapiSingleResponse<T> = { data: T | null; meta?: unknown }

export type StrapiMedia = {
    url?: string
    alternativeText?: string | null
    caption?: string | null
    formats?: Record<string, { url?: string }>
}

export type StrapiSeo = {
    Meta_title?: string | null
    Meta_description?: string | null
    Meta_keywords?: string | null
    OG_title?: string | null
    OG_description?: string | null
    OG_image?: StrapiMedia | null
}

export type BlockTextContent = {
    __component: 'blocks.text-content'
    id: number
    Title?: string | null
    Text_content?: string | null
}

export type BlockImageListItem = {
    id: number
    Title?: string | null
    Text_content?: string | null
    Image?: StrapiMedia | null
}

export type BlockImageListContent = {
    __component: 'blocks.image-list-content'
    id: number
    Title?: string | null
    Items?: BlockImageListItem[] | null
}

export type BlockMapContent = {
    __component: 'blocks.map-content'
    id: number
    Title?: string | null
    Text_content?: string | null
    Map_url?: string | null
}

export type Homepage = {
    id: number
    locale: string
    Title?: string | null
    Sub_title?: string | null
    Copyright?: string | null
    Hero_image?: StrapiMedia | null
    SEO?: StrapiSeo | null
    Block?: Array<
        BlockTextContent |
        BlockImageListContent |
        BlockMapContent |
        Record<string, any>
    > | null
}