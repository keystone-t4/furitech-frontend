<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <header class="header">
    <div class="header__inner block">
      <NuxtLink class="header__logo" :to="localePath('/')" aria-label="To home">
        <NuxtImg src="/img/logo.webp"
                 alt="logo"
                 format="webp"
                 fallback="/img/logo.png"
        />
      </NuxtLink>
      <div></div>
      <HeaderLangListBox class="header__lang"/>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  display: flex;
  justify-content: center;
  position: fixed;
  background-color: white;
  z-index: 1000;

  &__inner {
    width: 100%;
    display: grid;
    padding-top: 1rem;
    padding-bottom: 1rem;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: end;
  }

  &__logo {
    width: 180px;
    @media (max-width: 636px) {
      width: 140px;
    }
  }

  &__lang {
    justify-self: end;
  }

  &__title {
    font-weight: bold;
    font-size: 2rem;
    cursor: pointer;
    user-select: none;
  }
}
</style>
