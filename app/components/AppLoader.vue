<script setup lang="ts">
import { ref } from 'vue'

let length = 170
const rows = []

while (length-- > 0) {
  const circles = []

  while (length % 13) {
    circles.push({})
    length--
  }

  rows.push(circles)
}
</script>

<template>
  <section class="circles">
    <div class="row" v-for="(row, r) in rows" :key="r">
      <div class="circle" v-for="(c, i) in row" :key="i"></div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@keyframes spin {
  0% {
    transform: rotate(0) scale(1.1);
  }
  50% {
    transform: rotate(180deg) scale(0.9);
  }
  100% {
    transform: rotate(360deg) scale(1.1);
  }
}
.circles {
  margin: 0 auto;
}
.circle {
  width: 10px;
  height: 10px;
  margin: 5px 10px;
  background: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  transform-origin: top center;
}
.row {
  display: flex;
  flex: 0 1 100%;
  @for $i from 1 through 19 {
    &:nth-child(#{$i}) {
      .circle {
        animation-delay: 100ms * $i;
      }
    }
  }
}
</style>