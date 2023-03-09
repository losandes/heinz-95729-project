<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import { useDarkModeStore } from './header/light-dark-switch/store.js'
  import Header from './header/header.vue'

  const darkModeStore = useDarkModeStore()
</script>

<template>
<div :class="darkModeStore.name" class="overflow-x-hidden">
	<Header />
	<main class="min-h-screen
	           bg-white dark:bg-smoke-800
		         text-slate-800 dark:text-slate-300">
		<div class="p-8">
			<RouterView />
		</div>
	</main>
</div>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="./assets/vue.svg" width="125" height="125" />

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView /> -->
</template>
