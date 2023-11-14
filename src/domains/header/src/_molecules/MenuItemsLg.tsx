import { Link } from 'react-router-dom'
import useNavStore from '../state/nav-store'

export default function MenuItemsLg() {
  const pages = useNavStore((state) => state.pages)
  return (
  <div className="
      hidden h-full ml-8
      lg:flex lg:justify-center lg:space-x-8
    ">
      {pages.map((page) => (
        <Link
          key={page.name}
          to={page.href}
          className="
            flex items-center
            text-sm font-medium
            text-smoke-100 hover:text-brand-cyan
        ">
          {page.name}
        </Link>
      ))}
    </div>
  )
}
