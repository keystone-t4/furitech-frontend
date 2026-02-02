<script setup lang="ts">
import MarkdownIt from 'markdown-it'

type StrapiMedia = {
  url?: string
  alternativeText?: string | null
  caption?: string | null
  formats?: Record<string, { url?: string }>
}

type Item = {
  id: number
  Title?: string | null
  Text_content?: string | null
  Image?: StrapiMedia | null
}

type BlockImageListContent = {
  id: number
  __component: 'blocks.image-list-content'
  Title?: string | null
  Items?: Item[] | null
}

const props = defineProps<{
  block: BlockImageListContent
}>()

const config = useRuntimeConfig()
const baseStrapiUrl = (config.public.strapiUrl || '').replace(/\/$/, '')

function strapiMediaUrl(path?: string) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${baseStrapiUrl}${path}`
}

const md = new MarkdownIt({
  breaks: true,
  linkify: true,
})

function renderMd(raw?: string | null) {
  return raw ? md.render(raw) : ''
}
</script>

<template>
  <section class="block block--image-list">
    <h2 v-if="block.Title" class="block__title">{{ block.Title }}</h2>

    <div v-if="block.Items?.length" class="items">
      <article v-for="item in block.Items" :key="item.id" class="item">
        <img
            v-if="item.Image?.url"
            class="item__img"
            :src="strapiMediaUrl(item.Image.formats?.small?.url || item.Image.url)"
            :alt="(item.Image.alternativeText || item.Image.caption || item.Title || '').toString()"
        />

        <h3 v-if="item.Title" class="item__title">{{ item.Title }}</h3>
        <div v-if="item.Text_content" class="item__content" v-html="renderMd(item.Text_content)" />
      </article>
    </div>
  </section>
</template>

<style scoped>
.block__title {
  margin-bottom: 12px;
}
.items {
  display: grid;
  gap: 16px;
}
.item {
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  padding: 16px;
}
.item__img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 10px;
  margin-bottom: 12px;
}
.item__title {
  margin: 0 0 8px;
}
.item__content :deep(p) {
  margin: 0 0 10px;
}
.item__content :deep(ul) {
  margin: 0 0 10px 20px;
}
</style>
