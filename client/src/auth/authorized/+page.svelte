<script>
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
	import { authStore, AUTH_STATES, verify } from '../auth-store.js'

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
</script>

<svelte:head>
	<title>Authorized</title>
	<meta name="description" content="landing page to verify that the autorization worked" />
</svelte:head>

<div></div>
