import CloseButtonSm from '../_molecules/CloseButtonSm'
import FlyoutMenu from '../_molecules/FlyoutMenu'
import MenuItemsSm from '../_molecules/MenuItemsSm'
import CurrencySelector from '../_molecules/CurrencySelector'
import ProfileOrLoginSm from '../_molecules/ProfileOrLoginSm'

export default function PrimaryNavSm() {
  return (
    <FlyoutMenu>
      <CloseButtonSm />
      <MenuItemsSm />
      <ProfileOrLoginSm />
      <div className="space-y-6 border-t border-gray-200 px-4 py-6">
        <CurrencySelector size="sm" />
      </div>
    </FlyoutMenu>
  )
}
