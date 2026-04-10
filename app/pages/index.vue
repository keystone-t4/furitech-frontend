<script setup lang="ts">
import {useStrapiLocale} from "~/composable/useStrapiLocale";
import {useStrapiSeo} from "~/composable/useStrapiSeo";
import {useStrapiMedia} from "~/composable/useStrapiMedia";
import BlocksTextContent from '~/components/Blocks/textContent.vue'
import BlocksImageListContent from '~/components/Blocks/imageListContent.vue'
import BlocksMapContent from '~/components/Blocks/mapContent.vue'
import type { StrapiSingleResponse, Homepage } from "~/types/strapi-types";

// ================= LOGIC =================

const config = useRuntimeConfig()
const strapiLocale = useStrapiLocale()
const { strapiMediaUrl } = useStrapiMedia()

const baseStrapiUrl = computed(() => (config.public.backend || '').replace(/\/$/, ''))

function homepageRequestUrl(locale: string) {
  const params = new URLSearchParams()

  params.set('locale', locale)
  params.set('populate[Hero_image]', 'true')
  params.set('populate[Block][on][blocks.text-content][populate]', '*')
  params.set('populate[Block][on][blocks.image-list-content][populate][Items][populate][Image]', 'true')
  params.set('populate[Block][on][blocks.map-content][populate]', '*')
  params.set('populate[SEO][populate]', '*')
  return `${baseStrapiUrl.value}/api/homepage?${params.toString()}`
}

const { data: homepage, pending, error } = await useAsyncData(
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

if (data.value) {
  useStrapiSeo({
    seo: data.value.SEO,
    title: data.value.Title,
    description: data.value.Sub_title,
    image: heroSrc.value,
    siteName: 'Furitech',
    fallbackDescription: data.value.Sub_title
  })
}

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
  padding-top: 79px;
  width: 100%;
  @media (max-width: 636px) {
    padding-top: 68px;
  }

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
    @media (max-width: 480px) {
      padding-left: 18px;
    }
  }
  &__hero-title {
    min-height: fit-content;
    line-height: 120%;
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