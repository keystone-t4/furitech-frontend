<script setup lang="ts">
import type { FooterType } from '#shared/types/strapi-types'

defineProps<{
  footer: FooterType
}>()
</script>

<template>
  <footer class="footer">
    <Container class="footer__inner">
      <hr class="footer__line line" />
      <p class="footer__copyright">
        {{ footer.copyright }}
      </p>
    </Container>
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

  &__line {
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
}
</style>
