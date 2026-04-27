<script setup lang="ts">
import MarkdownIt from "markdown-it";

type BlockMapContent = {
  id: number
  __component: 'blocks.map-content'
  Title?: string | null
  Text_content?: string | null
  Map_url?: string | null
}

const props = defineProps<{ block: BlockMapContent }>()

const md = new MarkdownIt({ breaks: true, linkify: true })

const html = computed(() => md.render(props.block?.Text_content ?? ''))

const mapSrc = computed(() => props.block?.Map_url ?? '')

const showMap = ref(false)
const mapRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!mapSrc.value) return

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (!entry) return

    if (entry.isIntersecting) {
      showMap.value = true
      observer.disconnect()
    }
    },
    {
      rootMargin: "200px"
    }
    )

  if (mapRef.value) {
    observer.observe(mapRef.value)
  }
})
</script>

<template>
  <section
    ref="mapRef"
    class="map-content"
    :class="mapSrc ? 'map-content--light' : ''"
  >
    <div
        class="map-content__inner block"
        :class="mapSrc ? 'map-content__inner--light' : ''"
    >
      <div
          class="map-content__description"
          :class="mapSrc ? 'map-content__description--light' : ''"
      >
        <h2
            v-if="block.Title"
            class="map-content__title title"
            :class="mapSrc ? 'map-content__title--light' : ''"
        >
          {{ block.Title }}
        </h2>

        <hr
            class="map-content__line line"
            :class="mapSrc ? 'map-content__line--light' : ''"
        />

        <div
            v-if="html"
            class="map-content__content"
            :class="mapSrc ? 'map-content__content--light' : ''"
            v-html="html"
        />
      </div>

      <iframe
        title="Google Maps location"
        v-if="showMap && mapSrc"
        class="map-content__map"
        width="450"
        height="250"
        frameborder="0"
        style="border:0"
        referrerpolicy="no-referrer-when-downgrade"
        :src="mapSrc"
        loading="lazy"
        allowfullscreen
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.map-content {
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
  }

  &__map {
    width: 100%;
    height: 100%;
    padding: 2rem 0;

    min-height: 350px;
  }
}
</style>
