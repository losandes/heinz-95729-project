import { ref } from 'vue'
import { defineStore } from 'pinia'

const transition1 = {
  on: 'scale-100 duration-300',
  off: 'scale-0 duration-500',
}
const transition2 = {
  on: 'opacity-100 scale-100',
  off: 'opacity-0 scale-0',
}
const lightDarkStates = {
  light: {
    name: 'light',
    copy: 'Enable dark mode',
    bg: 'bg-pelorous-500 text-cyan-200 focus-visible:ring-cyan-600',
    ariaChecked: false,
    lightModeSun: transition1.off,
    lightModeMoon: transition1.on,
    midSpanClass: '',
    darkModeSun: transition2.on,
    darkModeMoon: transition2.off,
  },
  dark: {
    name: 'dark',
    copy: 'Disable dark mode',
    bg: 'bg-smoke-500 text-slate-200 focus-visible:ring-slate-500',
    ariaChecked: true,
    lightModeSun: transition1.on,
    lightModeMoon: transition1.off,
    midSpanClass: 'translate-x-[2.625rem]',
    darkModeSun: transition2.off,
    darkModeMoon: transition2.on,
  },
}

const validMode = (maybeMode) => maybeMode === 'light' ? 'light' : 'dark'
const getModeOrDefault = () =>
  typeof localStorage !== 'undefined'
    ? validMode(localStorage.getItem('dark-mode'))
    : 'dark'

export const useDarkModeStore = defineStore('darkMode', () => {
  let _initMode = getModeOrDefault()
  const name = ref(_initMode)
  const copy = ref(lightDarkStates[_initMode].copy)
  const bg = ref(lightDarkStates[_initMode].bg)
  const ariaChecked = ref(lightDarkStates[_initMode].ariaChecked)
  const lightModeSun = ref(lightDarkStates[_initMode].lightModeSun)
  const lightModeMoon = ref(lightDarkStates[_initMode].lightModeMoon)
  const midSpanClass = ref(lightDarkStates[_initMode].midSpanClass)
  const darkModeSun = ref(lightDarkStates[_initMode].darkModeSun)
  const darkModeMoon = ref(lightDarkStates[_initMode].darkModeMoon)

  const toggle = () => {
    if (name.value === 'dark') {
      _initMode = 'light'
    } else {
      _initMode = 'dark'
    }

    localStorage.setItem('dark-mode', _initMode)

    name.value = _initMode
    copy.value = lightDarkStates[_initMode].copy
    bg.value = lightDarkStates[_initMode].bg
    ariaChecked.value = lightDarkStates[_initMode].ariaChecked
    lightModeSun.value = lightDarkStates[_initMode].lightModeSun
    lightModeMoon.value = lightDarkStates[_initMode].lightModeMoon
    midSpanClass.value = lightDarkStates[_initMode].midSpanClass
    darkModeSun.value = lightDarkStates[_initMode].darkModeSun
    darkModeMoon.value = lightDarkStates[_initMode].darkModeMoon
  }

  return {
    name,
    copy,
    bg,
    ariaChecked,
    lightModeSun,
    lightModeMoon,
    midSpanClass,
    darkModeSun,
    darkModeMoon,
    toggle,
  }
})
