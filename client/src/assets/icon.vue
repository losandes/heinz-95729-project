<script setup>
  import { computed } from 'vue'
  const props = defineProps({
    /**
     * NOTE this object is cloned. Everything in this
     * object will lose it's scope so don't access
     * anything in the outer scope
     */
    name: {
      type: String,
      default: 'none',
    },
    fill: {
      type: String,
      default: 'none', // none, currentColor
    },
    stroke: {
      type: String,
      default: 'currentColor', // none, currentColor
    },
    strokeWidth: {
      type: String,
      default: '1.5', // '1.5', '0'
    },
    size: {
      type: String,
      default: 'md'   // md, sm
    },
    // viewBox: {
    //   type: String,
    //   default: (rawProps) => {
    //     if (rawProps.viewBox) {
    //       return viewBox
    //     } else if (rawProps.size === 'sm') {
    //       return '0 0 24 24'
    //     } else {
    //       return '0 0 24 24'
    //     }
    //   },
    // },
    // hw: {
    //   type: String,
    //   default: (rawProps) => {
    //     if (rawProps.hwOptions) {
    //       return hwOptions
    //     } else if (rawProps.size === 'sm') {
    //       return 'h-4 w-4'
    //     } else {
    //       return 'h-6 w-6'
    //     }
    //   },
    // },
    iconCss: {
      type: String,
      default: 'text-gray-600 dark:text-gray-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-200',
    },
  })

  const viewBox = computed(() => props.size === 'sm' ? '0 0 24 24' : '0 0 24 24')
  const hw = computed(() => props.size === 'sm' ? 'h-4 w-4' : 'h-6 w-6')
</script>

<template>
  <!-- Icons from: https://heroicons.com/ -->
  <svg :class="props.iconCss + hw"
      :viewBox="viewBox"
      :fill="props.fill"
      :stroke="props.stroke"
      :stroke-width="props.strokeWidth"
      aria-hidden="true">
    <path v-if="props.name === 'home-modern'" stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
    <path v-else-if="props.name === 'information-circle'" stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    <path v-else-if="props.name === 'finger-print'" stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
    <path v-else-if="props.name === 'arrow-path'" stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    <g v-else-if="props.name === 'chart-pie'">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
    </g>
    <path v-else-if="props.name === 'table-cells'" stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
  </svg>
</template>
