<script setup lang="ts">
import { useStrapi } from '~/composable/useStrapi'
import type { FooterType } from '#shared/types/strapi-types'
import { useLocaleContent } from '~/composable/useContent'

const strapi = useStrapi()
const content = useLocaleContent()
const { locale } = useI18n()

const { data: footer } = await useAsyncData<FooterType>(
  () => `footer-${locale.value}`,
  async () => (import.meta.server ? await strapi.getFooter(locale.value) : content.value.footer),
)
</script>

<template>
  <div class="body">
    <AppHeader />
    <slot />
    <AppFooter v-if="footer" :footer="footer" />
  </div>
</template>

<style lang="scss">
.body {
  font-family:
    'Montserrat',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    Arial,
    sans-serif;
  font-weight: 400;
  color: var(--text-dark);
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100svh;
}
</style>
