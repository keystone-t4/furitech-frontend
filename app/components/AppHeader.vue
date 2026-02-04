<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <header class="header">
    <div class="header__inner block">
      <div></div>
      <NuxtLink class="header__logo" :to="localePath('/')" aria-label="To home">
        <NuxtImg src="/img/logo.webp"
                 alt="logo"
                 format="webp"
                 fallback="/img/logo.png"
        />
      </NuxtLink>
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

  &__inner {
    width: 100%;
    display: grid;
    padding-top: 1rem;
    padding-bottom: 1rem;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: end;
  }

  &__logo {
    width: 240px;
    justify-self: center;
    @media (max-width: 636px) {
      width: 200px;
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
