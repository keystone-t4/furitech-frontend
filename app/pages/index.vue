<script setup lang="ts">
import { useStrapi } from '~/composable/useStrapi'
import { useLocaleContent } from '~/composable/useContent'
import type { HomePageType } from '#shared/types/strapi-types'
import { useSeo } from '~/composable/useStrapiSeo'

//todo: почему при при внесении правки в одном файле - преттиер правит каким то боком другие, каждый раз, при том визуально изменений не видно, но git это индексирует

const strapi = useStrapi()
const localeContent = useLocaleContent()
const { locale } = useI18n()

const content = computed(() => localeContent.value)

const { data: home_page } = await useAsyncData<HomePageType>(
  () => `homepage-${locale.value}`,
  async () =>
    import.meta.server ? await strapi.getHomePage(locale.value) : content.value.home_page,
)

const hero_image_url = computed(() => home_page.value?.hero_image?.url ?? null)

const isTextBlock = (block: HomePageBlock): block is BlockTextContent =>
  block.__component === 'blocks.text-content'

const isImageListBlock = (block: HomePageBlock): block is BlockImageListContent =>
  block.__component === 'blocks.image-list-content'

const isMapBlock = (block: HomePageBlock): block is BlockMapContent =>
  block.__component === 'blocks.map-content'

const blocks = computed<HomePageBlock[]>(() => home_page.value?.block ?? [])

useSeo(home_page.value?.seo)
</script>

<template>
  <main class="home">
    <HeroSection
      v-if="home_page?.title"
      :title="home_page.title"
      :sub-title="home_page.sub_title"
      :hero-img="hero_image_url"
    />

    <template v-for="block in blocks" :key="`${block.__component}-${block.id}`">
      <TextSection v-if="isTextBlock(block)" :block="block" />
      <ImageListSection v-else-if="isImageListBlock(block)" :block="block" />
      <MapSection v-else-if="isMapBlock(block)" :block="block" />
      <div v-else style="display: none" />
    </template>
  </main>
</template>

<style scoped lang="scss">
.home {
  padding-top: 79px;
  width: 100%;
  flex: 1;
  @media (max-width: 636px) {
    padding-top: 68px;
  }
}
</style>
