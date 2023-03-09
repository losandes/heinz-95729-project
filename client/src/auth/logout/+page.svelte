<script>
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
	import { logger } from '$lib/logger/index.js'
  import { post } from '$lib/fetch/fetch-wrapper'
	import { authStore, AUTH_STATES, verify } from '../auth-store.js'

  let loading = true

  /**
   * We're going to verify that the logout was successful in onMount
   * wait for verification before forwarding the user
   */
  // @ts-ignore
  authStore.subscribe(({ authState }) => {
    if (browser && authState === AUTH_STATES.AUTHENTICATED) {
      goto('/')
    } else if (browser) {
      goto('/auth/login')
    }
	})

	onMount(async () => {
		try {
      const res = await post('/logout', {
        isValid: () => res.status === 302 || (res.status >= 200 && res.status < 300),
        deserialize: async (/** @type {{ text: () => any; }} */ res) => res.text()
      })

			await verify()
    } catch (e) {
      logger.emit('auth_state_verification_failed', 'error', e)
      throw e
    }
	})
</script>

<svelte:head>
	<title>Logout</title>
	<meta name="description" content="sign out of R&P Forecast" />
</svelte:head>

{#if loading}
  <p>Signing out...</p>
{:else}
  <p>Signed out...</p>
{/if}
