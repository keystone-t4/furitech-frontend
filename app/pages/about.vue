<script setup lang="ts">
const localePath = useLocalePath()
const goToAuth = () => {
  navigateTo(localePath('/auth'))
}

const { locale, locales } = useI18n()


const config = useRuntimeConfig()
const strapiLocale = locales.value.find((item) => item.code === locale.value)?.language

const { data: aboutpage } = await useFetch(
    `${config.public.url}/api/aboutpage`,
    {
      key: `aboutpage-${strapiLocale}`,
      query: {
        populate: '*',
        locale: strapiLocale
      }
    }
)

</script>

<template>
  <div class="about" v-if="aboutpage">
    <div class="about__inner">
     <h1 v-if="aboutpage.data.Hero[0].Title" class="about__title">
        {{ aboutpage.data.Hero[0].Title }}
      </h1>
      <p>
        {{ aboutpage.data.Hero[0].Sub_title }}
      </p>
      <button @click="goToAuth">
        {{ $t('button.go-to')}}
      </button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.about {
  width: 100%;
  padding: 1rem 0;
  display: flex;
  justify-content: center;

  &__inner {
    display: flex;
    width: var(--layout-width);
    margin: var(--layout-margin);
    justify-content: space-between;
    align-items: start;
    flex-direction: column;
  }

  &__title {
    color: var(--accent-color);
    font-size: 3rem;
  }
}
</style>