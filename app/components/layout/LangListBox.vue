<script setup lang="ts">
import { computed } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import type { ComputedRef } from 'vue'

type LocaleCode = 'en' | 'fr' | 'es'

interface LocaleOption {
  code: string
  label: string
  href: string
}

const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const localeOptions: ComputedRef<LocaleOption[]> = computed(() => {
  const list = locales.value ?? []
  return list.map((l) => {
    const key = `locales.${l.code}`
    const label = t(key)
    return {
      code: l.code as string,
      label: label === key ? (l.name ?? l.code) : label,
      href: switchLocalePath(l.code as LocaleCode) || '/',
    }
  })
})

const selectedLabel = computed(() => {
  const option = localeOptions.value.find((o) => o.code === locale.value)
  return option?.label ?? locale.value
})
</script>

<template>
  <div class="locale-switch">
    <Listbox as="div" class="locale" :model-value="locale">
      <ListboxLabel class="sr-only">Language</ListboxLabel>
      <ListboxButton class="locale__button">
        <span class="locale__button-text">{{ selectedLabel }}</span>
        <svg class="locale__arrow" width="8" height="10" viewBox="0 0 8 10">
          <path
            d="M3.99991 1.5L3.99991 8.19818M7.09138 5.62195L4.36425 8.34909C4.16303 8.5503 3.8368 8.5503 3.63558 8.34909L0.908447 5.62195"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            fill="none"
          />
        </svg>
      </ListboxButton>
      <transition>
        <ListboxOptions class="locale__options">
          <ListboxOption
            v-for="opt in localeOptions"
            v-slot="{ active, selected }"
            :key="opt.code"
            :value="opt.code"
            as="template"
          >
            <a
              :href="opt.href"
              :class="['locale__option', active && 'is-active', selected && 'is-selected']"
            >
              {{ opt.label }}
            </a>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </Listbox>
  </div>
</template>

<style scoped lang="scss">
.locale-switch {
  display: flex;
  align-items: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.locale {
  position: relative;

  &__button {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    width: var(--locale-width);
    padding: 10px 12px;
    border: 0;
    background: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    user-select: none;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1;
    transition: background 0.3s;

    @media (max-width: 636px) {
      padding: 8px 10px;
    }

    &:hover {
      background: rgba(141, 141, 141, 0.18);
    }

    &:focus-visible {
      box-shadow: 0 0 0 2px var(--focus-visible-color);
      outline: none;
    }
  }

  &__button-text {
    display: inline-block;
    max-width: 220px;
    min-width: fit-content;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-dark);
  }

  &__arrow {
    width: 8px;
    height: 10px;
    color: var(--text-dark);
    stroke: var(--text-dark);
    transition: transform 0.5s;
  }

  &__button[aria-expanded='true'] .locale__arrow {
    transform: scale(1, -1);
  }

  &__options {
    position: absolute;
    width: var(--locale-width);
    min-width: var(--locale-width);
    max-height: 240px;
    padding: 6px;
    background: #fff;
    z-index: 50;
    visibility: hidden;
    opacity: 0;
    transition:
      opacity 0.3s,
      transform 0.3s,
      visibility 0.3s;

    @media (max-width: 636px) {
      padding: 6px;
    }
  }

  &__button[aria-expanded='true'] ~ &__options {
    visibility: visible;
    opacity: 1;
  }

  &__option {
    display: block;
    padding: 6px;
    cursor: pointer;
    user-select: none;
    color: var(--text-dark);
    text-decoration: none;
    transition: background 0.2s;

    @media (max-width: 636px) {
      padding: 4px;
    }

    &:hover,
    &.is-active {
      background: rgba(141, 141, 141, 0.18);
    }

    &.is-selected {
      font-weight: 800;
    }
  }
}
</style>
