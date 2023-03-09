<script setup>
  import Logo from '../assets/logo.vue'
</script>
<template>
  <section>
    <div class="flex">
      <Logo class="h-24 -mt-2" />
      <h1 class="font-black text-4xl mb-1 text-pelorous-500 dark:text-smoke-300">
        {{ $t("home.welcome") }}
        <br />
        <span class="text-transparent bg-clip-text bg-gradient-to-br from-pelorous-500 to-medium-red-violet-500">
          {{ $t("home.lightningBook") }}
        </span>
      </h1>
    </div>
  </section>
</template>
