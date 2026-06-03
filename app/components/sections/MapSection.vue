<script setup lang="ts">
import Title from '~/components/ui/Title.vue'
import { renderMarkdown } from '~/utils/markdown'

const props = defineProps<{
  block: BlockMapContent
}>()

const showMap = ref(false)
const mapRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!props.block?.map_url) return

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry) return

      if (entry.isIntersecting) {
        showMap.value = true
        observer.disconnect()
      }
    },
    {
      rootMargin: '1000px',
    },
  )
  if (mapRef.value) {
    observer.observe(mapRef.value)
  }
})
</script>

<template>
  <section ref="mapRef" class="map-content">
    <Container class="map-content__inner">
      <div class="map-content__description">
        <Title v-if="block.title" :text="block.title" />
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-if="block.text_content"
          class="map-content__content"
          v-html="renderMarkdown(block.text_content)"
        />
        <!--eslint-enable-->
      </div>
      <iframe
        v-if="showMap && block.map_url"
        title="Google Maps location"
        class="map-content__map"
        width="450"
        height="250"
        frameborder="0"
        style="border: 0"
        referrerpolicy="no-referrer-when-downgrade"
        :src="block.map_url"
        allowfullscreen
      />
    </Container>
  </section>
</template>

<style scoped lang="scss">
.map-content {
  width: 100%;
  padding: 0;

  &__inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: stretch;
    @media (max-width: 930px) {
      grid-template-columns: 1fr;
      padding-bottom: 2rem;
    }
  }

  &__description {
    padding: 2rem 0;
  }

  &__content {
    font-size: 18px;
    color: var(--text-light);
  }

  &__map {
    width: 100%;
    height: 100%;
    padding: 2rem 0;
    min-height: 350px;
  }
}
</style>
