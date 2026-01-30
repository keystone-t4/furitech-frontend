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
const localePath = useLocalePath()

const goToHomepage = () => {
  navigateTo(localePath('/'))
}

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
  <header class="header">
    <div class="header__inner">
      <div class="header__title" @click="goToHomepage">
        Furitech
      </div>

      <div class="header__locale-switch">
        <Listbox v-model="selectedCode" as="div" class="locale">
          <ListboxLabel class="sr-only">Language</ListboxLabel>

          <ListboxButton class="locale__button">
            <span class="locale__button-text">{{ selectedLabel }}</span>

            <svg
                class="locale__chevron"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
            >
              <path
                  d="M6 8l4 4 4-4"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
              />
            </svg>
          </ListboxButton>

          <transition
              leave-active-class="fade-leave-active"
              leave-from-class="fade-leave-from"
              leave-to-class="fade-leave-to"
          >
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
                  <span v-if="selected" class="locale__check" aria-hidden="true">✓</span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>
      </div>
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

  &__locale-switch {
    display: flex;
    align-items: center;
  }
}

/* screen-reader only */
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
    min-width: 160px;
    padding: 8px 12px;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.25);
    background: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    user-select: none;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1;

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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__chevron {
    flex: 0 0 auto;
    opacity: 0.75;
  }

  &__options {
    position: absolute;

    margin-top: 8px;
    min-width: 220px;
    max-height: 240px;
    overflow: auto;
    border-radius: 12px;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
    padding: 6px;
    z-index: 50;

    &:focus {
      outline: none;
    }
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    padding: 10px 10px;
    border-radius: 10px;
    cursor: pointer;
    user-select: none;

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

  &__check {
    flex: 0 0 auto;
    font-weight: 900;
  }
}

/* transition classes (leave only, как в примере headlessui) */
.fade-leave-active {
  transition: opacity 100ms ease-in;
}
.fade-leave-from {
  opacity: 1;
}
.fade-leave-to {
  opacity: 0;
}
</style>
