<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const config = useRuntimeConfig()
const { locale } = useI18n()

const baseStrapiUrl = computed(() =>
    (config.public.backend || '').replace(/\/$/, '')
)

function errorPageRequestUrl(locale: string) {
  const params = new URLSearchParams()
  params.set('locale', locale)
  params.set('populate', '*')

  return `${baseStrapiUrl.value}/api/error-page?${params.toString()}`
}

const { data: errorPage } = await useAsyncData(
    () => `error-page:${locale.value}`,
    () => $fetch(errorPageRequestUrl(locale.value)),
    { watch: [locale] }
)

const errorData = computed(() => errorPage.value?.data)

const is404 = computed(() => props.error.statusCode === 404)

const errorText = computed(() => {
  if (is404.value && errorData.value?.Page_not_found_text) {
    return errorData.value.Page_not_found_text
  }
  return props.error.statusMessage
})

const buttonText = computed(() => {
  if (is404.value && errorData.value?.Main_page_button_text) {
    return errorData.value.Main_page_button_text
  }
  return 'Go back home'
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="error-layout block">
      <h1 class="error-layout__title">
        {{ error.statusCode }}
      </h1>

      <p class="error-layout__paragraph paragraph">
        {{ errorText }}
      </p>

      <NuxtLink class="button" to="/">
        {{ buttonText }}
      </NuxtLink>
    </div>
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