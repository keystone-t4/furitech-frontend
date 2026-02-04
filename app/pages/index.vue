<script setup lang="ts">
import {useStrapiLocale} from "~/composable/useStrapiLocale";
import BlocksTextContent from '~/components/Blocks/textContent.vue'
import BlocksImageListContent from '~/components/Blocks/imageListContent.vue'
import BlocksMapContent from '~/components/Blocks/mapContent.vue'

//Вынести в отдельную директорию types

type StrapiSingleResponse<T> = { data: T | null; meta?: unknown }

type StrapiMedia = {
  url?: string
  alternativeText?: string | null
  caption?: string | null
  formats?: Record<string, { url?: string }>
}

type BlockTextContent = {
  __component: 'blocks.text-content'
  id: number
  Title?: string | null
  Text_content?: string | null
}

type BlockImageListItem = {
  id: number
  Title?: string | null
  Text_content?: string | null
  Image?: StrapiMedia | null
}

type BlockImageListContent = {
  __component: 'blocks.image-list-content'
  id: number
  Title?: string | null
  Items?: BlockImageListItem[] | null
}

type BlockMapContent = {
  __component: 'blocks.map-content'
  id: number
  Title?: string | null
  Text_content?: string | null
  Map_url?: string | null
}

type Homepage = {
  id: number
  locale: string
  Title?: string | null
  Sub_title?: string | null
  Copyright?: string | null
  Hero_image?: StrapiMedia | null
  Block?: Array<
      BlockTextContent |
      BlockImageListContent |
      BlockMapContent |
      Record<string, any>
  > | null
}

const config = useRuntimeConfig()
const strapiLocale = useStrapiLocale()

const baseStrapiUrl = computed(() => (config.public.strapiUrl || '').replace(/\/$/, ''))

function strapiMediaUrl(path?: string) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${baseStrapiUrl.value}${path}`
}

function homepageRequestUrl(locale: string) {
  const params = new URLSearchParams()

  params.set('locale', locale)

  params.set('populate[Hero_image]', 'true')

  params.set('populate[Block][on][blocks.text-content][populate]', '*')

  params.set('populate[Block][on][blocks.image-list-content][populate][Items][populate][Image]', 'true')

  params.set('populate[Block][on][blocks.map-content][populate]', '*')

  return `${baseStrapiUrl.value}/api/homepage?${params.toString()}`
}

const {
  data: homepage,
  pending,
  error,
} = await useAsyncData(
    () => `homepage:${strapiLocale.value}`,
    () => $fetch<StrapiSingleResponse<Homepage>>(homepageRequestUrl(strapiLocale.value)),
    { watch: [strapiLocale] }
)

const data = computed(() => homepage.value?.data)

const title = computed(() => data.value?.Title ?? '')
const subTitle = computed(() => data.value?.Sub_title ?? '')

const hero = computed(() => data.value?.Hero_image ?? null)
const heroSrc = computed(() => {
  const h = hero.value
  const url =
      h?.url ||
      h?.formats?.small?.url ||
      h?.formats?.medium?.url ||
      h?.formats?.large?.url
  return strapiMediaUrl(url)
})

const blocks = computed(() => data.value?.Block ?? [])

const blockComponentMap: Record<string, any> = {
  'blocks.text-content': BlocksTextContent,
  'blocks.image-list-content': BlocksImageListContent,
  'blocks.map-content': BlocksMapContent,
}
</script>

<template>
  <main class="home">
      <p v-if="pending">Loading…</p>
      <p v-else-if="error">Failed to load homepage</p>
      <template v-else>
        <div class="home__hero" :style="{ backgroundImage: heroSrc ? `url(${heroSrc})` : undefined }">
          <div class="block">
            <div class="home__hero-text">
              <h1 v-if="title" class="home__hero-title">{{ title }}</h1>
              <p v-if="subTitle" class="home__subtitle">{{ subTitle }}</p>
            </div>
          </div>
        </div>

        <div class="home__blocks">
          <template v-for="block in blocks" :key="`${block.__component ?? 'unknown'}:${block.id ?? Math.random()}`">
            <component
                v-if="block?.__component && blockComponentMap[block.__component]"
                :is="blockComponentMap[block.__component]"
                :block="block"
            />
          </template>
        </div>

      </template>
  </main>
</template>

<style scoped lang="scss">
.home {
  padding-top: 96px;
  width: 100%;

  &__hero {
    height: 100dvh;
    max-height: 1152px;
    min-height: fit-content;
    width: 100%;
    max-width: 2064px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-position: center center;
    background-blend-mode: normal;
    background-repeat: no-repeat;
    background-size: cover;
    @media (max-width: 768px) {
      background-position: 60%;
    }
    @media (max-width: 576px) {
      background-position: 65%;
    }
  }
  &__hero .block {
    width: 100%;
    min-height: fit-content;
  }
  &__hero-text {
    min-height: fit-content;
    color: white;
    padding-left: 30px;
    border-left: 1.5px solid white;
    @media (max-width: 480px) {
      padding-left: 18px;
    }
  }
  &__hero-title {
    min-height: fit-content;

    font-family: 'ArchivoBlack', 'Arial', 'sans-serif';
    font-size: 56px;
    max-width: 750px;
    @media (max-width: 806px) {
      font-size: 44px;
    }
    @media (max-width: 636px) {
      font-size: 30px;
    }
    @media (max-width: 480px) {
      font-size: 24px;
    }
    @media (max-width: 480px) {
      font-size: 22px;
    }
  }
  &__subtitle {
    min-height: fit-content;

    opacity: 0.8;
    margin-top: 8px;
    font-size: 22px;
    @media (max-width: 636px) {
      font-size: 18px;
    }
    @media (max-width: 480px) {
      font-size: 1rem;
    }
    @media (max-width: 480px) {
      font-size: 14px;
    }
  }

  &__blocks {
    width: 100%;
  }
}
</style>
