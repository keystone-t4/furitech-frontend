<script setup lang="ts">
import Container from '~/components/ui/Container.vue'
import Title from '~/components/ui/Title.vue'
import type { BlockImageListContent } from '#shared/types/strapi-types'
import { renderMarkdown } from '~/utils/markdown'

defineProps<{
  block: BlockImageListContent
}>()
</script>

<template>
  <section class="image-list-content">
    <Container>
      <Title v-if="block.title" :text="block.title" />
      <div v-if="block.items.length" class="image-list-content__items">
        <article
          v-for="item in block.items"
          :key="item.id"
          class="image-list-content__item item"
          :style="
            item.image?.url || item.image_mobile?.url
              ? {
                  '--bg-image': item.image?.url ? `url(${item.image.url})` : 'none',

                  '--bg-image-mobile': `url(${item.image_mobile?.url || item.image?.url})`,
                }
              : undefined
          "
        >
          <div class="item__inner">
            <h3 v-if="item.title" class="item__title">
              {{ item.title }}
            </h3>

            <!-- eslint-disable vue/no-v-html -->
            <div
              v-if="item.text_content"
              class="item__content"
              v-html="renderMarkdown(item.text_content)"
            />
            <!--eslint-enable-->
          </div>
        </article>
      </div>
    </Container>
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
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: -20% 0;
    background-image: var(--bg-image);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    z-index: 0;
    @media (max-width: 480px) {
      background-image: var(--bg-image-mobile);
    }
  }

  &__inner {
    position: relative;
    z-index: 2;
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
