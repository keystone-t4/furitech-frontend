<script setup lang="ts">
defineProps<{
  title: string
  subTitle: string | null
  heroImg: string | null
}>()
</script>

<template>
  <section class="hero">
    <NuxtImg
      v-if="heroImg"
      :src="heroImg"
      alt=""
      class="hero__bg"
      fetchpriority="high"
      loading="eager"
    />
    <Container>
      <div class="hero__text">
        <h1 v-if="title" class="hero__title">{{ title }}</h1>
        <p v-if="subTitle" class="hero__subtitle">{{ subTitle }}</p>
      </div>
    </Container>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  overflow: hidden;
  height: 100dvh;
  max-height: 1152px;
  min-height: fit-content;
  width: 100%;
  max-width: 2064px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-position: center center;
  background-blend-mode: normal;
  background-repeat: no-repeat;
  background-size: cover;

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;

    z-index: 0;
    @media (max-width: 768px) {
      object-position: 60%;
    }
    @media (max-width: 576px) {
      object-position: 65%;
    }
  }
  &__text {
    min-height: fit-content;
    color: white;
    @media (max-width: 480px) {
      padding-left: 18px;
    }
  }
  &__title {
    min-height: fit-content;
    line-height: 120%;
    font-family: 'ArchivoBlack', 'Arial', 'sans-serif';
    font-size: 56px;
    max-width: 750px;
    @media (max-width: 806px) {
      font-size: 44px;
    }
    @media (max-width: 636px) {
      font-size: 30px;
    }
    @media (max-width: 480px) {
      font-size: 24px;
    }
    @media (max-width: 480px) {
      font-size: 22px;
    }
  }
  &__subtitle {
    min-height: fit-content;
    opacity: 0.8;
    margin-top: 8px;
    font-size: 22px;
    @media (max-width: 636px) {
      font-size: 18px;
    }
    @media (max-width: 480px) {
      font-size: 1rem;
    }
    @media (max-width: 480px) {
      font-size: 14px;
    }
  }

  .block {
    position: relative;
    z-index: 1;
    width: 100%;
    min-height: fit-content;
  }
}
</style>
