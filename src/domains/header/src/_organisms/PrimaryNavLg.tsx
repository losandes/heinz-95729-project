import { Cart } from '@domains/cart'
import LogoLg from '../_molecules/LogoLg'
import LogoSm from '../_molecules/LogoSm'
import MenuIconsLg from '../_molecules/MenuIconsLg'
import MenuIconsSm from '../_molecules/MenuIconsSm'
import MenuItemsLg from '../_molecules/MenuItemsLg'

export default function PrimaryNavLg() {
  return (
    <div className="
      mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8
      flex items-center justify-between
      bg-smoke-800
      border-b border-smoke-900
    ">
      <LogoLg />
      <MenuItemsLg />
      <MenuIconsSm />
      <LogoSm />
      <div className="flex flex-1 items-center justify-end lg:ml-8">
        <MenuIconsLg />
        <span className="mx-4 h-6 w-px bg-smoke-200 lg:mx-6" aria-hidden="true" />
        <Cart />
      </div>
    </div>
  )
}
