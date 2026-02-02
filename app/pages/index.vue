<script setup lang="ts">
import {useStrapiLocale} from "~/composable/useStrapiLocale";
import BlocksTextContent from '~/components/Blocks/textContent.vue'
import BlocksImageListContent from '~/components/Blocks/imageListContent.vue'


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

type Homepage = {
  id: number
  locale: string
  Title?: string | null
  Sub_title?: string | null
  Copyright?: string | null
  Hero_image?: StrapiMedia | null
  Block?: Array<BlockTextContent | BlockImageListContent | Record<string, any>> | null
}

const config = useRuntimeConfig()
const strapiLocale = useStrapiLocale()

const baseStrapiUrl = computed(() => (config.public.strapiUrl || '').replace(/\/$/, ''))

function strapiMediaUrl(path?: string) {
  if (!path) return ''
  // если Strapi когда-то начнёт отдавать абсолютные ссылки — тоже ок
  if (/^https?:\/\//i.test(path)) return path
  return `${baseStrapiUrl.value}${path}`
}

function homepageRequestUrl(locale: string) {
  const params = new URLSearchParams()

  params.set('locale', locale)

  params.set('populate[Hero_image]', 'true')

  params.set('populate[Block][on][blocks.text-content][populate]', '*')

  params.set('populate[Block][on][blocks.image-list-content][populate][Items][populate][Image]', 'true')

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
const copyright = computed(() => data.value?.Copyright ?? '')

const hero = computed(() => data.value?.Hero_image ?? null)
const heroSrc = computed(() => {
  const h = hero.value
  const url =
      h?.formats?.large?.url ||
      h?.formats?.medium?.url ||
      h?.formats?.small?.url ||
      h?.url
  return strapiMediaUrl(url)
})
const heroAlt = computed(() => {
  const h = hero.value
  return (h?.alternativeText || h?.caption || title.value || '').toString()
})

const blocks = computed(() => data.value?.Block ?? [])

const blockComponentMap: Record<string, any> = {
  'blocks.text-content': BlocksTextContent,
  'blocks.image-list-content': BlocksImageListContent,
}
</script>

<template>
  <section class="home">
    <!-- Hero -->
    <div v-if="heroSrc" class="home__hero">
      <img class="home__hero-img" :src="heroSrc" :alt="heroAlt" />
    </div>

    <div class="home__inner">
      <p v-if="pending">Loading…</p>
      <p v-else-if="error">Failed to load homepage</p>

      <template v-else>
        <header class="home__header">
          <h1 v-if="title">{{ title }}</h1>
          <p v-if="subTitle" class="home__subtitle">{{ subTitle }}</p>
        </header>

        <!-- Dynamic blocks -->
        <div class="home__blocks">
          <template v-for="block in blocks" :key="`${block.__component ?? 'unknown'}:${block.id ?? Math.random()}`">
            <component
                v-if="block?.__component && blockComponentMap[block.__component]"
                :is="blockComponentMap[block.__component]"
                :block="block"
            />
            <!-- неизвестные блоки просто игнорируем -->
          </template>
        </div>

        <footer v-if="copyright" class="home__footer">
          <small>{{ copyright }}</small>
        </footer>
      </template>
    </div>
  </section>
</template>

<style scoped>
.home__hero {
  width: 100%;
  overflow: hidden;
}
.home__hero-img {
  width: 100%;
  height: auto;
  display: block;
}
.home__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}
.home__header {
  margin: 16px 0 24px;
}
.home__subtitle {
  opacity: 0.8;
  margin-top: 8px;
}
.home__blocks {
  display: grid;
  gap: 24px;
}
.home__footer {
  margin-top: 32px;
  opacity: 0.8;
}
</style>
