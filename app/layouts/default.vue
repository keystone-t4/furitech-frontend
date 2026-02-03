<script setup lang="ts">
const head = useLocaleHead()
</script>

<template>
    <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
        <Head>
            <template v-for="link in head.link" :key="link.key">
              <Link :id="link.key" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
            </template>
            <template v-for="meta in head.meta" :key="meta.key">
              <Meta :id="meta.key" :property="meta.property" :content="meta.content" />
            </template>
        </Head>

        <Body class="body">
            <AppHeader/>
            <slot/>
            <AppFooter/>
        </Body>
    </Html>
</template>

<style lang="scss">
.body {
  font-family: 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif;
  font-weight: 400;
  color: var(--text-dark);
  position: relative;
  width: 100%;
}
</style>