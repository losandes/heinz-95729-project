<script setup>
  import { useMenuStore } from './store.js'
  const menuStore = useMenuStore()
</script>

<template>
  <button id="header-menu-button"
          type="button"
          @click="menuStore.toggle"
          class="justify-end
          inline-flex items-center gap-x-1
          text-slate-800 dark:text-slate-300
          font-light text-lg tracking-tight leading-6"
          aria-expanded="false">
    <span>Menu</span>
    <svg  xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          :aria-hidden="menuStore.chevronHidden"
          :class="menuStore.chevronCss"
          class="h-5 w-5 transition">
    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
  </svg>
  </button> <!-- // /header-menu-button -->
</template>
