import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from '../utils/axios.js'
import logger from '../utils/logger.js'
import isBrowserRuntime from '../utils/is-browser.js'

export const AUTH_STATES = {
  VERIFYING: 'VERIFYING',
  AUTHENTICATED: 'AUTHENTICATED',
  NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
}

export const useAuthStore = defineStore('auth', () => {
  const state = ref(AUTH_STATES.VERIFYING)

  const verify = async () => {
    const { data } = await axios.get('/session/test')

    const { authenticated } = data
    const value = authenticated
      ? AUTH_STATES.AUTHENTICATED
      : AUTH_STATES.NOT_AUTHENTICATED

    state.value = value
    logger.emit('auth_verification_success', 'trace', data)
  }

  if (isBrowserRuntime()) {
    // initialize the state, but only if this code is
    // running in the browser
    verify()
  }

  return { state, verify }
})
