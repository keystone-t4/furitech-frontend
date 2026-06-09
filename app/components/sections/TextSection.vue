<script setup lang="ts">
import Title from '~/components/ui/Title.vue'
import type { BlockTextContent } from '#shared/types/strapi-types'
import { renderMarkdown } from '~/utils/markdown'

defineProps<{
  block: BlockTextContent
}>()
</script>

<template>
  <section class="text-content">
    <Container class="text-content__inner" :class="block.image ? 'text-content__inner--img' : ''">
      <div class="text-content__description">
        <Title :text="block.title" />
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-if="block.text_content"
          class="text-content__content"
          v-html="renderMarkdown(block.text_content)"
        />
        <!--eslint-enable-->
      </div>
      <picture v-if="block.image?.url">
        <source
          v-if="block.image_mobile?.url"
          media="(max-width: 480px)"
          :srcset="block.image_mobile.url"
        />

        <source :srcset="block.image.url" />

        <img :src="block.image.url" alt="" class="text-content__img" />
      </picture>
    </Container>
  </section>
</template>

<style scoped lang="scss">
.text-content {
  width: 100%;
  padding: 0;

  &__inner {
    margin: 0 auto;

    &--img {
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

  &__description {
    padding: 2rem 0;
  }

  &__content {
    font-size: 18px;
    color: var(--text-light);
    @media (max-width: 636px) {
      font-size: 1rem;
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
