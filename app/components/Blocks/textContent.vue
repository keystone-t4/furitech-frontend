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
const baseStrapiUrl = (config.public.backend || '').replace(/\/$/, '')

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
  <section class="text-content"
           :class="imageSrc ? 'text-content--light' : ''"
  >
    <div class="text-content__inner block"
         :class="imageSrc ? 'text-content__inner--light' : ''"
    >
      <div class="text-content__description"
           :class="imageSrc ? 'text-content__description--light' : ''"

      >
        <h2 v-if="block.Title"
            class="text-content__title title"
            :class="imageSrc ? 'text-content__title--light' : ''"
        >
          {{ block.Title }}
        </h2>
        <hr class="text-content__line line"
            :class="imageSrc ? 'text-content__line--light' : ''"
        />
        <div v-if="html"
             class="text-content__content"
             v-html="html"
             :class="imageSrc ? 'text-content__content--light' : ''"
        />
      </div>
      <img v-if="imageSrc" class="text-content__img" :src="imageSrc" :alt="imageAlt" />
    </div>

  </section>
</template>

<style scoped lang="scss">
.text-content {
  width: 100%;
  padding: 2rem 0;


  &--light {
    padding: 0;
  }

  &__inner {
    margin: 0 auto;

    &--light {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: stretch;

      @media (max-width: 930px) {
        grid-template-columns: 1fr;
        padding-bottom: 2rem;
      }
    }
  }



  &__description--light {
    padding: 2rem 0;
  }
  &__content {
    font-size: 18px;
    color: var(--text-light);
    @media (max-width: 636px) {
      font-size: 1rem
    }
    }

  &__img {
    width: 100%;
    height: 100%;
    padding: 2rem 0;

    object-fit: cover;
    object-position: center;

    display: block;
  }
}
</style>
