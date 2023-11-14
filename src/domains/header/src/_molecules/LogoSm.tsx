import { Link } from 'react-router-dom';

export default function Example() {
  return (
    <Link to="/" className="lg:hidden">
      <span className="sr-only">Lightning Book</span>
      <span className="flex items-center -space-x-8 w-auto">
        <img
          className="h-8"
          src="/logo/logo-text-left.svg"
          alt="logo"
        />
        <img
          className="h-8"
          src="/logo/logo.svg"
          alt="logo"
        />
        <img
          className="h-8"
          src="/logo/logo-text-right.svg"
          alt="logo"
        />
      </span>
    </Link>
  )
}
