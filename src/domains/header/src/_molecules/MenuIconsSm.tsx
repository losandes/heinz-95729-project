// TODO: replace search anchor with a search command palette (also in MenuIconsLg.tsx)
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { toggleOpen } from '../state/nav-store'

export default function MenuIconsSm () {
  return (
    <div className="flex flex-1 items-center lg:hidden">
      <button
        onClick={toggleOpen}
        type="button"
        className="
          -ml-2 p-2
          rounded-md
          bg-smoke-800
          text-smoke-100
          hover:text-dracula-purple
      ">
        <span className="sr-only">Open menu</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Search */}
      <a href="#" className="ml-2 p-2 text-smoke-100 hover:text-dracula-purple">
        <span className="sr-only">Search</span>
        <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
      </a>
    </div>
  )
}
