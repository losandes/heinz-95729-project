<script>
  const { VITE_API_ORIGIN, VITE_PROXY_PATH } = import.meta.env
  const apiRoute = `${VITE_API_ORIGIN}${VITE_PROXY_PATH}/login`
</script>

<svelte:head>
	<title>Login</title>
	<meta name="description" content="sign in to R&P Forecast" />
</svelte:head>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div class="min-w-full max-w-sm px-2 col-span-1">
    <form action={apiRoute} method="POST" class="
      bg-white dark:bg-smoke-700
      shadow-md
      rounded
      px-8
      pt-6
      pb-8
      mb-4"
    > <div class="mb-4">
        <label for="forecast_token" class="
          block
          text-slate-700 dark:text-slate-300
          text-sm
          font-bold
          mb-2">
          Forecast Auth Token
        </label>
        <input id="forecast_token"
          name="forecast_token"
          type="password"
          required
          placeholder="******************"
          class="
            shadow
            appearance-none
            border
            rounded
            w-full
            py-2
            px-3
            text-slate-700
            leading-tight
            focus:outline-none
            focus:shadow-outline">
      </div>
      <div class="mb-6">
        <label for="bamboohr_token" class="
          block
          text-slate-700 dark:text-slate-300
          text-sm
          font-bold
          mb-2">
          Bamboo API Token
        </label>
        <input id="bamboohr_token"
          name="bamboohr_token"
          type="password"
          required
          placeholder="******************"
          class="
            shadow
            appearance-none
            border
            rounded
            w-full
            py-2
            px-3
            text-slate-700
            leading-tight
            focus:outline-none
            focus:shadow-outline">
      </div>
      <div class="flex justify-end">
        <button type="submit" class="
          bg-blue-500 hover:bg-blue-700
          text-white
          font-bold
          py-2
          px-4
          rounded
          focus:outline-none
          focus:shadow-outline">
          Sign In
        </button>
      </div>
    </form>
    <p class="text-center text-slate-500 text-xs">
      &copy;2023 Robots & Pencils All rights reserved.
    </p>
  </div>
  <div class="
    font-extralight
    rounded
    overflow-hidden
    shadow-lg
    px-2
    mt-8
    md:mt-0
    col-span-1 lg:col-span-2"
  > <h2 class="text-2xl mb-2">To get your Forecast Auth Token:</h2>
    <ol class="list-decimal list-inside">
      <li>Open the developer console in your browser and choose the "Navigator" tab</li>
      <li>Navigate to forecast (e.g. https://forecastapp.com/554085/schedule/projects)</li>
      <li>Click on one of the API calls (e.g. https://api.forecastapp.com/roles)</li>
      <li>Find the Authorization header in the Request Headers and copy the whole value</li>
      <li>In your terminal, `export FORECAST_AUTH_TOKEN="[value]"`</li>
    </ol>
    <br />
    <br />
    <h2 class="text-2xl mb-2">To create or get your BambooHR API Token, ask Andy for one or:</h2>
    <ol class="list-decimal list-inside">
      <li>Sign in to BambooHR</li>
      <li>Click your avatar in the top right corner and choose, API Keys</li>
      <li>Click, "Add New Key", give it a name (e.g. talent-reports), and then click "Generate Key"</li>
      <li>Add the API key to your 1Password vault... this is the last time it will be presented to you by BambooHR</li>
      <li>In your terminal, `export BAMBOOHR_AUTH_TOKEN="[value]"` (note there is no Bearer|Basic|etc prefix for this one)</li>
    </ol>
    <br />
    <em>note that, in order for your API token to work, you need the permissions that are granted to Andy and Brad for Bamboo reporting</em>
  </div>
</div>
