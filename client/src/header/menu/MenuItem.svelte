<script>
  import { page } from '$app/stores'
	import IconFrame from '$lib/images/IconFrame.svelte'
	import Icon from '$lib/images/Icon.svelte'
  import { observableMenuState } from './menu-state.js'

  /** @type {IMenuItem | undefined} */
  export let item = undefined

  export let size = 'lg' // lg, sm

  let menuState = 'closed'

  observableMenuState.subscribe((state) => {
    menuState = state
  })

  /**
   * @param {IMenuItem} [item]
   * @returns {(event: Event) => void}
   */
  const toggleMenuState = (item) => (event) => {
    if (menuState === 'closed') {
      observableMenuState.update(() => 'opened')
    } else {
      observableMenuState.update(() => 'closed')
    }

    if (typeof item?.onClick === 'function') {
      item?.onClick(event)
    }
  }
</script>

{#if size === 'sm' }
  <a href="{item?.path}"
     aria-current={$page.url.pathname === item?.path ? 'page' : undefined}
     class="flex items-center justify-center gap-x-2.5
            p-3
            font-semibold
            text-smoke-900 dark:text-slate-300
            hover:bg-smoke-200 dark:hover:bg-smoke-500
            {item?.css}"
     on:click={toggleMenuState(item)}>
      <Icon name="{item?.icon}" fill="none" size="sm" />
      {item?.label}
  </a>
{:else}
  <div class="relative group flex gap-x-6
              rounded-lg
              p-4
              hover:bg-smoke-100 dark:hover:bg-smoke-600">
    <IconFrame css={item?.iconFrameCss}>
      <Icon name="{item?.icon}" fill="none" size="md" />
    </IconFrame>
    <div>
      <a href="{item?.path}"
          aria-current={$page.url.pathname === item?.path ? 'page' : undefined}
          class="font-semibold
              text-gray-900 hover:text-indigo-600
              dark:text-slate-300 dark:hover:text-indigo-200
              {item?.css}
              {$page.url.pathname === item?.path ? 'underline decoration-sky-500' : ''}"
          on:click={toggleMenuState(item)}>
            {item?.label}
            <span class="absolute inset-0"></span>
      </a>
      <p class="mt-1 text-gray-600 dark:text-mineshaft-400">{item?.description}</p>
    </div>
  </div>
{/if}
