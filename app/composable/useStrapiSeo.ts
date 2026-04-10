import type { StrapiSeo } from "~/types/strapi-types";
import { unref } from 'vue'

type MaybeRef<T> = T | Ref<T>

type UseStrapiSeoInput = {
    seo?: MaybeRef<StrapiSeo | null>
    title?: MaybeRef<string | null>
    description?: MaybeRef<string | null>
    image?: MaybeRef<string | null>
    siteName?: string
    fallbackDescription?: MaybeRef<string | null>
}

export const useStrapiSeo = (input: UseStrapiSeoInput) => {
    const route = useRoute()
    const config = useRuntimeConfig()
    const siteUrl = (config.public.backend || '').replace(/\/$/, '')

    const title = computed(() =>
        unref(input.seo)?.Meta_title?.trim() ||
        unref(input.title)?.trim() ||
        'Furitech'
    )

    const description = computed(() =>
        unref(input.seo)?.Meta_description?.trim() ||
        unref(input.description)?.trim() ||
        unref(input.fallbackDescription)?.trim() ||
        ''
    )

    const ogTitle = computed(() =>
        unref(input.seo)?.OG_title?.trim() || title.value
    )

    const ogDescription = computed(() =>
        unref(input.seo)?.OG_description?.trim() || description.value
    )

    const ogImage = computed(() =>
        unref(input.seo)?.OG_image?.url || unref(input.image) || ''
    )

    const keywords = computed(() =>
        unref(input.seo)?.Meta_keywords?.trim() || ''
    )

    useHead(() => ({
        title: title.value,
        meta: [
            { name: 'description', content: description.value },
            { name: 'keywords', content: keywords.value },
            { property: 'og:title', content: ogTitle.value },
            { property: 'og:description', content: ogDescription.value },
            { property: 'og:type', content: 'website' },
            { property: 'og:site_name', content: input.siteName || 'Furitech' },
            { property: 'og:url', content: `${siteUrl}${route.fullPath}` },
            { property: 'og:image', content: ogImage.value || undefined },
        ]
    }))
}