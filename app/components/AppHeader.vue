<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <div></div>
      <NuxtLink :to="localePath('/')" aria-label="To home">
        <NuxtImg class="header__logo"
                 src="/img/logo.webp"
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
  padding: 1rem var(--layout-indent);
  display: flex;
  justify-content: center;
  position: fixed;
  background-color: white;

  &__inner {
    display: grid;
    width: var(--layout-width);
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
  }

  &__logo {
    width: 240px;
    justify-self: center;
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
