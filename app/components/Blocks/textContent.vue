<script setup lang="ts">
import MarkdownIt from 'markdown-it'

type StrapiMedia = {
  url?: string
  alternativeText?: string | null
  caption?: string | null
  formats?: Record<string, { url?: string }>
}

type BlockTextContent = {
  id: number
  __component: 'blocks.text-content'
  Title?: string | null
  Text_content?: string | null
  Image?: StrapiMedia | null
}

const props = defineProps<{ block: BlockTextContent }>()

const config = useRuntimeConfig()
const baseStrapiUrl = (config.public.strapiUrl || '').replace(/\/$/, '')

function strapiMediaUrl(path?: string) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${baseStrapiUrl}${path}`
}

const md = new MarkdownIt({ breaks: true, linkify: true })

const defaultImageRule =
    md.renderer.rules.image ??
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))

md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const srcIndex = token.attrIndex('src')
  if (srcIndex >= 0) {
    const src = token.attrs![srcIndex][1]
    token.attrs![srcIndex][1] = strapiMediaUrl(src)
  }
  return defaultImageRule(tokens, idx, options, env, self)
}

const html = computed(() => md.render(props.block?.Text_content ?? ''))

const imageSrc = computed(() => {
  const img = props.block?.Image
  const url =
      img?.formats?.large?.url ||
      img?.formats?.medium?.url ||
      img?.formats?.small?.url ||
      img?.url
  return strapiMediaUrl(url)
})

const imageAlt = computed(() => {
  const img = props.block?.Image
  return (img?.alternativeText || img?.caption || props.block?.Title || '').toString()
})
</script>

<template>
  <section class="block block--text">
    <h2 v-if="block.Title" class="block__title">{{ block.Title }}</h2>

    <img v-if="imageSrc" class="block__img" :src="imageSrc" :alt="imageAlt" />

    <div v-if="html" class="block__content" v-html="html" />
  </section>
</template>

<style scoped>
.block__img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 12px;
  margin: 12px 0 14px;
}
</style>
