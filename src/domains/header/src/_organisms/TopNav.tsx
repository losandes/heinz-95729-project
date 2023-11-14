import ProfileOrLoginLg from '../_molecules/ProfileOrLoginLg'
import CallToAction from '../_molecules/CallToAction'
import CurrencySelector from '../_molecules/CurrencySelector'

export default function TopNav() {
  return (
    <div className="bg-dracula-purple">
      <div className="
        mx-auto h-10 max-w-7xl px-4 sm:px-6 lg:px-8
        flex items-center justify-between
      ">
        <CurrencySelector size="lg" />
        <CallToAction />
        <ProfileOrLoginLg />
      </div>
    </div>
  )
}
