<script setup lang="ts">
import type { NuxtError } from '#app'
import { useStrapi } from '~/composable/useStrapi'
import type { ErrorPageType } from '#shared/types/strapi-types'
import { useLocaleContent } from '~/composable/useContent'

const props = defineProps<{
  error: NuxtError
}>()

const strapi = useStrapi()
const content = useLocaleContent()
const { locale } = useI18n()

const is404 = computed(() => props.error.status === 404)

const { data: error_page } = await useAsyncData<ErrorPageType>(
  () => `error-page-${locale.value}`,
  async () =>
    import.meta.server ? await strapi.getErrorPage(locale.value) : content.value.error_page,
)

const errorText = computed(() => {
  if (is404.value && error_page.value?.page_not_found_text) {
    return error_page.value.page_not_found_text
  }
  return props.error.statusText
})

const mainLocaleRoute = computed(() => {
  return locale.value === 'en' ? '/' : `/${locale.value}`
})
</script>

<template>
  <NuxtLayout name="default">
    <Container class="error-layout">
      <h1 class="error-layout__title">
        {{ error.status }}
      </h1>

      <p class="error-layout__paragraph paragraph">
        {{ errorText }}
      </p>
      <Button
        v-if="error_page?.main_page_button_text"
        :text="error_page.main_page_button_text"
        :path="mainLocaleRoute"
      />
    </Container>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.error-layout {
  padding-top: calc(var(--header-height) + var(--layout-indent));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  flex: 1;

  &__paragraph {
    margin-bottom: 20px;
  }
}
</style>
