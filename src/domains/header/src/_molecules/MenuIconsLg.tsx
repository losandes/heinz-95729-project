// TODO: replace search anchor with a search command palette (also in MenuIconsSm.tsx)
import {
  MagnifyingGlassIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

export default function MenuIconsLg () {
  return (
    <div className="flex space-x-8">
      <div className="hidden lg:flex">
        <a href="#" className="-m-2 p-2 text-smoke-100 hover:text-dracula-purple">
          <span className="sr-only">Search</span>
          <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
        </a>
      </div>

      <div className="flex">
        <Link to="/chat" className="-m-2 p-2 text-smoke-100 hover:text-dracula-purple">
          <span className="sr-only">Chat</span>
          <ChatBubbleBottomCenterTextIcon className="h-6 w-6" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
