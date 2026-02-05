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
const baseStrapiUrl = (config.public.backend || '').replace(/\/$/, '')

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
  <section class="image-list-content block">
    <h2 v-if="block.Title" class="image-list-content__title title">
      {{ block.Title }}
    </h2>
    <hr class="image-list-content__line line"/>

    <div v-if="block.Items?.length" class="image-list-content__items">
      <article
          v-for="item in block.Items"
          :key="item.id"
          class="image-list-content__item item"
          :style="
    item.Image?.url
      ? {
          '--bg-image': `url(${strapiMediaUrl(
            item.Image.formats?.small?.url || item.Image.url
          )})`,
        }
      : undefined
  "
      >
        <div class="item__inner">
          <h3 v-if="item.Title" class="item__title">
            {{ item.Title }}
          </h3>

          <div
              v-if="item.Text_content"
              class="item__content"
              v-html="renderMd(item.Text_content)"
          />
        </div>
      </article>
    </div>
  </section>
</template>


<style scoped lang="scss">
.image-list-content {
  width: 100%;
  padding-top: 2rem;
  padding-bottom: 2rem;
  margin: 0 auto;

  &__content {
    font-size: 18px;
    color: var(--text-light);
  }

  &__items {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    @media (max-width: 930px) {
      grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 636px) {
      grid-template-columns: 1fr;
    }
  }
}

.item {
    padding: 1.5rem;
    color: white;
    min-height: 400px;

    position: relative;
    overflow: hidden; // важно: прячем всё, что "вылезло"

    // фон-картинка
    &::before {
      content: '';
      position: absolute;

      // делаем картинку выше родителя (вылезает вверх/вниз)
      inset: -20% 0; // сверху/снизу -20%, слева/справа 0

      background-image: var(--bg-image);
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover; // тянем по ширине/вписываем с кропом
      z-index: 0;
    }

  &__inner {
    position: relative;
    z-index: 2; // текст поверх фона и оверлея
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__title {
    font-size: 32px;
  }

  &__content {
    font-size: 18px;
  }
}
</style>
