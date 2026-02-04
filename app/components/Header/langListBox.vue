<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'

type LocaleLike = { code: string; name?: string }

const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const localeLabel = (code: string, fallback?: string) => {
  const key = `locales.${code}`
  const translated = t(key)
  return translated === key ? (fallback ?? code) : translated
}

const localeOptions = computed(() => {
  const list = (locales.value ?? []) as LocaleLike[]
  return list.map(l => ({
    code: l.code,
    label: localeLabel(l.code, l.name),
  }))
})
const selectedCode = ref<string>(locale.value)

watch(
    () => locale.value,
    (newLocale) => {
      selectedCode.value = newLocale
    }
)

watch(
    () => selectedCode.value,
    async (newCode, oldCode) => {
      if (!newCode || newCode === oldCode) return
      if (newCode === locale.value) return
      await navigateTo(switchLocalePath(newCode))
    }
)

const selectedLabel = computed(() => {
  return (
      localeOptions.value.find(o => o.code === selectedCode.value)?.label ??
      localeLabel(selectedCode.value)
  )
})
</script>

<template>
  <div class="locale-switch">
    <Listbox v-model="selectedCode" as="div" class="locale">
      <ListboxLabel class="sr-only">Language</ListboxLabel>
      <ListboxButton class="locale__button">
        <span class="locale__button-text">{{ selectedLabel }}</span>

        <svg class="locale__arrow" id="arrow"  width="8" height="10" viewBox="0 0 8 10">
          <path d="M3.99991 1.5L3.99991 8.19818M7.09138 5.62195L4.36425 8.34909C4.16303 8.5503 3.8368 8.5503 3.63558 8.34909L0.908447 5.62195" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
        </svg>

      </ListboxButton>
      <transition>
        <ListboxOptions class="locale__options">
          <ListboxOption
              v-for="opt in localeOptions"
              :key="opt.code"
              :value="opt.code"
              as="template"
              v-slot="{ active, selected }"
          >
            <li
                :class="[
                    'locale__option',
                    active && 'is-active',
                    selected && 'is-selected',
                  ]"
            >
              <span class="locale__option-text">{{ opt.label }}</span>
            </li>
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
    @media (max-width: 636px) {
      padding: 8px 10px;
    }

      &:hover {
      background: rgba(141, 141, 141, 0.18);
    }

    &:focus {
      outline: none;
    }

    &:focus-visible {
      box-shadow: 0 0 0 2px var(--focus-visible-color);
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
    transform: translateY(0);

    transition:
        opacity 0.3s,
        transform 0.3s,
        visibility 0.3s;

    @media (max-width: 636px) {
      padding: 6px;
    }
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 6px 6px;
    cursor: pointer;
    user-select: none;

    @media (max-width: 636px) {
      padding: 4px 4px;
    }

    &.is-active {
      background: rgba(141, 141, 141, 0.18);
    }

    &.is-selected {
      font-weight: 800;
    }
  }

  &__option-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.locale__button[aria-expanded="true"] + .locale__options {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
}

.locale__arrow {
  width: 8px;
  height: 10px;
  transition: transform 0.5s;
  color: var(--text-dark);
  stroke: var(--text-dark);
}

.locale__button[aria-expanded="true"] .locale__arrow {
  transform: scale(1, -1);
}
</style>