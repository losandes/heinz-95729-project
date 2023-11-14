import { Link } from 'react-router-dom'

const Hero = () => (
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <img
      className="mx-auto h-10 w-auto"
      src="/logo/logo.svg"
      alt="Lightning Book"
    />
    <h2 className="
      mt-10 text-center text-2xl font-bold leading-9 tracking-tight
      text-smoke-900
    ">
      Sign in to your account
    </h2>
  </div>
)

const Email = () => (
  <div>
    <label htmlFor="email" className="
      block text-sm font-medium leading-6 text-smoke-900
    ">
      Email address
    </label>
    <div className="mt-2">
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue="shopper1@95729.com"
        className="
          block w-full py-1.5
          text-smoke-900
          placeholder:text-gray-400
          sm:text-sm sm:leading-6
          rounded-md border-0 shadow-sm
          ring-1 ring-inset ring-gray-300
          focus:ring-2 focus:ring-inset focus:ring-dracula-purple
        "/>
    </div>
  </div>
)

const Password = () => (
  <div>
    <div className="flex items-center justify-between">
      <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
        Password
      </label>
      <div className="text-sm">
        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Forgot password?
        </a>
      </div>
    </div>
    <div className="mt-2">
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
    </div>
  </div>
)

const Submit = () => (
  <div>
    <button
      type="submit"
      className="
        px-3 py-1.5
        flex w-full justify-center
        bg-brand-violet hover:bg-dracula-purple
        text-sm font-semibold leading-6
        text-white
        rounded-md shadow-sm
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-dracula-purple"
    >
      Sign in
    </button>
  </div>
)

const Footer = () => (
  <p className="mt-10 text-center text-sm text-gray-500">
    Not a member?{' '}
    <Link to="/profile/register" className="font-semibold leading-6 text-brand-violet hover:text-dracula-purple">
      Sign up!
    </Link>
  </p>
)

export default function Login() {
  return (<>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Hero />
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="/api/login" method="POST">
          <Email />
          {/* <Password /> */}
          <Submit />
        </form>
        <Footer />
      </div>
    </div>
  </>)
}
