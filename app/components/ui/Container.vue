<template>
  <div class="block">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.block {
  max-width: var(--layout-width);
  padding-left: var(--layout-indent);
  padding-right: var(--layout-indent);
  margin: 0 auto;
}
</style>
