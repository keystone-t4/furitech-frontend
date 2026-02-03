<script setup lang="ts">
import { useStrapiLocale } from '~/composable/useStrapiLocale'

type StrapiSingleResponse<T> = { data: T | null }
type HomepageFooter = { Copyright?: string }

const config = useRuntimeConfig()
const locale = useStrapiLocale()

const baseUrl = (config.public.strapiUrl || '').replace(/\/$/, '')

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
      <hr class="footer__line"/>
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
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__line {
    width: 100%;
    border: 1px solid rgb(226, 226, 226);
    border-bottom: 0;
    margin: 2rem 0;
  }
}
</style>