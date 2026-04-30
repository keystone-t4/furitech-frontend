<script setup lang="ts">

type StrapiSingleResponse<T> = { data: T | null }
type HomepageFooter = { Copyright?: string }

const config = useRuntimeConfig()
const {locale} = useI18n()

const baseUrl = (config.public.backend || '').replace(/\/$/, '')

const { data } = await useAsyncData(
    () => `homepage-footer:${locale.value}`,
    () =>
        $fetch<StrapiSingleResponse<HomepageFooter>>(
            `${baseUrl}/api/homepage`,
            {
              params: {
                locale: locale.value,
                'fields[0]': 'Copyright',
              },
            }
        ),
    { watch: [locale] }
)

const copyright =
    computed(() => data.value?.data?.Copyright ?? '')
</script>

<template>
  <footer v-if="copyright" class="footer">
    <div class="footer__inner block">
      <hr class="footer__line line"/>
      <p class="footer__copyright">{{ copyright }}</p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: white;
  padding: 2rem 0;

  &__inner {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>