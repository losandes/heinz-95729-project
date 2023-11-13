import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <div className="hidden lg:flex lg:items-center">
      <Link to="/">
        <span className="sr-only">Lightning Book</span>
        <span className="flex items-center">
          <img
            className="h-8 w-auto"
            src="/logo/logo.svg"
            alt="logo"
          />
          <img
            className="h-8 w-auto"
            src="/logo/logo-text.svg"
            alt="logo text"
          />
        </span>
      </Link>
    </div>
  )
}
