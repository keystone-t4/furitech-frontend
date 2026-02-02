<script setup lang="ts">
const localePath = useLocalePath()

const goToHomepage = () => {
  navigateTo(localePath('/'))
}
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <div class="header__title" @click="goToHomepage">
        Furitech
      </div>

      <HeaderLangListBox/>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  padding: 1rem 0;
  display: flex;
  background-color: #8d8d8d;
  justify-content: center;

  &__inner {
    display: flex;
    width: var(--layout-width);
    margin: var(--layout-margin);
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-weight: bold;
    font-size: 2rem;
    cursor: pointer;
    user-select: none;
  }
}
</style>
