<script setup>
  import Logo from '../assets/logo.vue'
  import LogoText from '../assets/logo-text.vue'
  import LightDarkSwitch from './light-dark-switch/switch.vue'
  import MenuButton from './menu/menu-button.vue'
  import MenuItem from './menu/menu-item.vue'
  import { useMenuStore } from './menu/store.js'

  const menuStore = useMenuStore()
</script>

<template>
  <div id="header-nav-menu" class="relative">
    <div id="header-nav-menu-row"
        class="flex flex-row
               max-h-14 p-2 pr-4
               bg-white dark:bg-smoke-700 w-full
               border-slate-100 dark:border-neutral-600 border-b">
      <div class="max-h-8">
        <a href="/" class="text-sm text-pelorous-500 flex">
          <Logo class="h-10 -mt-1 -ml-1" />
          <LogoText css="hidden md:inline w-24 h-10 -mt-1 -ml-1"/>
        </a>
      </div>
      <div class="grow h-8"></div>
      <div class="h-8 mr-2 pt-0.5">
        <MenuButton />
      </div>
    </div> <!-- /header-nav-menu-row -->
    <div id="header-menu-outer-container"
         :class="menuStore.transition"
         class="bg-white dark:bg-smoke-800
                absolute
                max-w-max
                right-0 sm:-right-2
                sm:mt-2 sm:px-4">
      <div id="header-menu-inner-container"
          class="w-screen max-w-md
                 flex-auto
                 overflow-hidden
               bg-white dark:bg-smoke-700
                 text-sm leading-6
                 rounded-md ring-1 ring-smoke-900/5
                 shadow-lg">
        <div id="header-menu-items" class="p-4">
          <MenuItem v-for="item in menuStore.menu" :key="item.label" :item="item"></MenuItem>
        </div> <!-- /#menu-header-items -->
        <div id="menu-header-sub-items"
            class="grid grid-cols-2
                 bg-smoke-100 dark:bg-smoke-600
                   divide-x divide-smoke-900/5">
          <MenuItem v-for="item in menuStore.subMenu" :key="item.label" size="sm" :item="item"></MenuItem>
          <div class="flex items-center justify-center gap-x-2.5 p-3 h-8 mt-2">
            <LightDarkSwitch />
          </div>
        </div> <!-- /#menu-header-sub-items -->
      </div> <!-- /#header-menu-inner-container -->
    </div> <!-- /#header-menu-outer-container -->
  </div> <!-- /#header-nav-menu -->
</template>
