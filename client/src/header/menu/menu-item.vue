<script setup>
  import { RouterLink } from 'vue-router'
  import Icon from '../../assets/icon.vue'
  import { useMenuStore } from './store.js'
  const menuStore = useMenuStore()
  const props = defineProps({
    /**
     * NOTE this object is cloned. Everything in this
     * object will lose it's scope so don't access
     * anything in the outer scope
     */
    size: {
      type: String,
      default: 'lg', // lg, sm
    },
    item: {
      type: Object,
      default(rawProps) {
        return rawProps || {}
      }
    },
  })
</script>

<template>
  <RouterLink v-if="props.size === 'sm'" :to="item.path"
      :class="item.css"
      class="flex items-center justify-center gap-x-2.5
            p-3
            font-semibold
            text-smoke-900 dark:text-slate-300
            hover:bg-smoke-200 dark:hover:bg-smoke-500"
      @click="menuStore.toggle">
      <Icon :name="item.icon" fill="none" size="sm" />
      {{ item.label }}
  </RouterLink>
  <div v-else class="relative group flex gap-x-6
              rounded-lg
              p-4
              hover:bg-smoke-100 dark:hover:bg-smoke-600">
    <IconFrame :class="item.iconFrameCss">
      <Icon :name="item.icon" fill="none" size="md" />
    </IconFrame>
    <div>
      <RouterLink :to="item.path"
          :class="item.css"
          class="font-semibold
               text-gray-900 hover:text-indigo-600
               dark:text-slate-300 dark:hover:text-indigo-200"
          @click="menuStore.toggle">
          {{ item.label }}
          <span class="absolute inset-0"></span>
      </RouterLink>
      <p class="mt-1 text-gray-600 dark:text-mineshaft-400">
        {{ item.description }}
      </p>
    </div>
  </div>
</template>
