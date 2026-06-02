<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  text: string
  path: RouteLocationRaw
}>()
</script>

<template>
  <NuxtLink class="button" :to="path">
    {{ text }}
  </NuxtLink>
</template>

<style scoped lang="scss">
.button {
  min-width: fit-content;
  text-decoration: none;
  border-radius: 0.625rem;
  border: none;
  color: white;
  background-color: var(--accent-color);
  padding: 0.625rem 1.875rem;
  font-weight: 500;
  font-size: 1.125rem;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  @media (max-width: 480px) {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }
  &:hover {
    background-color: var(--accent-color-hover);
  }
}
</style>
