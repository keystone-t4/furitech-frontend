<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <h2 class="title">
    {{ text }}
  </h2>
  <hr class="line" />
</template>

<style scoped lang="scss">
.title {
  font-size: 42px;
  line-height: 120%;
  font-family: 'ArchivoBlack', 'Arial', 'sans-serif';

  @media (max-width: 806px) {
    font-size: 30px;
  }
  @media (max-width: 636px) {
    font-size: 24px;
  }
  @media (max-width: 480px) {
    font-size: 22px;
  }
  @media (max-width: 480px) {
    font-size: 20px;
  }
}
.line {
  width: 100%;
  border: 1px solid rgb(226, 226, 226);
  border-bottom: 0;
  margin-top: 1rem;
  margin-bottom: 2rem;
  @media (max-width: 636px) {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }
}
</style>
