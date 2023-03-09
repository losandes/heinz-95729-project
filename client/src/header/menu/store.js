import { ref } from 'vue'
import { defineStore } from 'pinia'
import { AUTH_STATES, useAuthStore } from '../../auth/store.js'
import { translate } from '../../utils/i18n.js'

const buttonStates = {
  opened: {
    name: 'opened',
    chevronHidden: true,
    chevronCss: 'rotate-180 duration-500',
		transition: 'transition ease-in duration-200 opacity-100 translate-y-0 z-10',
  },
  closed: {
    name: 'closed',
    chevronHidden: false,
    chevronCss: 'duration-300',
		transition: 'transition ease-out duration-150 opacity-0 translate-y-1 -z-10',
  },
}

const menuStates = {}

menuStates[AUTH_STATES.AUTHENTICATED] = {
	menu: [
		{ label: translate('menu.home.label'), icon: 'home-modern', path: '/', description: translate('menu.home.description') },
		{ label: translate('menu.about.label'), icon: 'information-circle', path: '/about', description: translate('menu.about.description') },
	],
	subMenu: [
		{ label: translate('menu.logout.label'), icon: 'finger-print', path: '/auth/logout', description: translate('menu.logout.description') },
	],
}

menuStates[AUTH_STATES.NOT_AUTHENTICATED] = {
	menu: [
		{ label: translate('menu.home.label'), icon: 'home-modern', path: '/', description: translate('menu.home.description') },
		{ label: translate('menu.about.label'), icon: 'information-circle', path: '/about', description: translate('menu.about.description') },
	],
	subMenu: [
		{ label: translate('menu.login.label'), icon: 'finger-print', path: '/auth/login', description: translate('menu.login.description') },
	],
}

menuStates[AUTH_STATES.VERIFYING] = {
  menu: [
		{
			label: translate('menu.loading.label'),
			description: translate('menu.loading.description'),
			icon: 'arrow-path',
			path: '/',
			iconFrameCss: 'animate-pulse opacity-75',
			css: 'animate-pulse opacity-75',
		},
	],
	subMenu: []
}

export const useMenuStore = defineStore('main-menu', () => {
	const authStore = useAuthStore()

  const name = ref(buttonStates.closed.name)
  const chevronHidden = ref(buttonStates.closed.chevronHidden)
  const chevronCss = ref(buttonStates.closed.chevronCss)
	const transition = ref(buttonStates.closed.transition)
	const menu = ref(menuStates[AUTH_STATES.VERIFYING].menu)
	const subMenu = ref(menuStates[AUTH_STATES.VERIFYING].subMenu)


  const toggle = () => {
    let mode = name.value === 'closed' ? 'opened' : 'closed'

    name.value = buttonStates[mode].name
    chevronHidden.value = buttonStates[mode].chevronHidden
    chevronCss.value = buttonStates[mode].chevronCss
		transition.value = buttonStates[mode].transition
  }

	authStore.$subscribe(() => {
		menu.value = menuStates[authStore.state].menu
		subMenu.value = menuStates[authStore.state].subMenu
	})

  return {
    name,
    chevronHidden,
    chevronCss,
		transition,
		menu,
		subMenu,
    toggle,
  }
})
