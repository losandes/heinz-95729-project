import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import useCartStore from '../state/cart-store'

export default function Cart() {
  const count = useCartStore((state) => state.count)

  return (
    <div className="flow-root">
      <Link to="/checkout" className="group -m-2 flex items-center p-2">
        <ShoppingCartIcon
          aria-hidden="true"
          className="
            h-6 w-6 flex-shrink-0
            text-smoke-100 group-hover:text-dracula-purple
        "/>
        <span className="
          ml-2 text-sm font-medium
          text-smoke-100 group-hover:text-dracula-purple
        ">
          {count}
        </span>
        <span className="sr-only">items in cart, view bag</span>
      </Link>
    </div>
  )
}
