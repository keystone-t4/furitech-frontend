<script setup lang="ts">
const { locale } = useI18n()
const config = useRuntimeConfig()

const strapiLocale = computed(() => {
  const l = locale.value || 'en'
  return l.includes('-') ? l.split('-')[0] : l
})

const { data: homepage, pending, error } = await useAsyncData(
    () => `homepage:${strapiLocale.value}`,
    () =>
        $fetch(`${config.public.strapiUrl}/api/homepage`, {
          query: { locale: strapiLocale.value },
        }),
    { watch: [strapiLocale] }
)

const title = computed(() => homepage.value?.data?.Title ?? '')

watchEffect(() => {
  console.log('req locale:', strapiLocale.value, 'resp locale:', homepage.value?.data?.locale, 'title:', title.value)
})
</script>

<template>
  <section class="home">
    <div class="home__inner">
      <h1 v-if="title">{{ title }}</h1>
      <p v-else-if="pending">Loading…</p>
      <pre v-else-if="error">{{ error }}</pre>
    </div>
  </section>
</template>
