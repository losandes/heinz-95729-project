<script>
	import { onMount } from 'svelte'
	import { clear as _clearStorage } from '$lib/storage/index.js'
	import LightDarkSwitch from './LightDarkSwitch.svelte'
	import Logo from './Logo.svelte'
	import MenuButton from './menu-button.vue'
	import MenuItem from './MenuItem.svelte'
	import { observableMenuState } from './menu-state.js'
	import { authStore, AUTH_STATES, verify } from '../auth/store.js'

	/** @type {IMenuItem[] } */
	let menu = []
	/** @type {IMenuItem[] } */
	let subMenu = []

	/**
	 * Clears local and session storage
	 * @param {Event} event
	 */
	const clearStorage = (event) => {
		event.preventDefault()
		_clearStorage()
	}

	// @ts-ignore
	authStore.subscribe(({ authState }) => {
		if (authState === AUTH_STATES.AUTHENTICATED) {
			menu = [
				{ label:'Home', icon: 'home-modern', path: '/', description: 'Not much here yet' },
				{ label:'People (BambooHR)', icon: 'table-cells', path: '/bamboohr-people', description: 'Active employee information pulled from BambooHR' },
				{ label:'About', icon: 'information-circle', path: '/about', description: 'Dev help for now' },
			]
			subMenu = [
				{ label:'Clear', icon: 'arrow-path', path: '/clear', description: 'Clear local and session storage', onClick: clearStorage },
				{ label:'Logout', icon: 'finger-print', path: '/auth/logout', description: 'Sign out' },
			]
		} else if (authState === AUTH_STATES.NOT_AUTHENTICATED) {
			menu = [
				{ label:'Home', icon: 'home-modern', path: '/', description: 'Not much here yet' },
				{ label:'About', icon: 'information-circle', path: '/about', description: 'Dev help for now' },
			]
			subMenu = [
				{ label:'Login', icon: 'finger-print', path: '/auth/login', description: 'Sign in' },
			]
		} else {
			menu = [
				{
					label: 'Loading...',
					description: 'checking to see if your authentication token is valid',
					icon: 'arrow-path',
					path: '/',
					iconFrameCss: 'animate-pulse opacity-75',
					css: 'animate-pulse opacity-75',
				},
			]
		}
	})

	const menuStates = {
		opened: {
			name: 'opened',
			transition: 'transition ease-in duration-200 opacity-100 translate-y-0 z-10',
		},
		closed: {
			name: 'closed',
			transition: 'transition ease-out duration-150 opacity-0 translate-y-1 -z-10',
		},
	}
	let menuState = menuStates.closed

	observableMenuState.subscribe((state) => {
		if (state === 'opened') {
			menuState = menuStates.opened
		} else {
			menuState = menuStates.closed
		}
	}

	onMount(async () => await verify())
</script>

<div id="header-nav-menu" class="relative">
	<div id="header-nav-menu-row"
		   class="flex flex-row
				      max-h-14 p-2 pr-4
							bg-white dark:bg-smoke-700 w-full
							border-slate-100 dark:border-neutral-600 border-b">
		<div class="max-h-8">
      <Logo />
		</div>
		<div class="grow h-8"></div>
		<div class="h-8 mr-2 pt-0.5">
			<MenuButton />
		</div>
		<div class="h-8 -mt-0.5">
			<LightDarkSwitch />
		</div>
	</div> <!-- /header-nav-menu-row -->
  <div id="header-menu-outer-container"
	     class="{menuState.transition}
			      bg-white dark:bg-smoke-800
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
				{#each menu as item}
					<MenuItem item={item} />
		    {/each}
      </div> <!-- /#menu-header-items -->
      <div id="menu-header-sub-items"
			     class="grid grid-cols-2
									bg-smoke-100 dark:bg-smoke-600
									divide-x divide-smoke-900/5">
				{#each subMenu as item}
				  <MenuItem size="sm" item={item} />
				{/each}
      </div> <!-- /#menu-header-sub-items -->
    </div> <!-- /#header-menu-inner-container -->
  </div> <!-- /#header-menu-outer-container -->
</div> <!-- /#header-nav-menu -->
