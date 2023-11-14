// TODO: add onChange handling for when a user selects a different currency

import { ChevronDownIcon } from '@heroicons/react/24/outline'

const currencies = ['USD', 'CAD', 'AUD', 'EUR', 'GBP']

const _CurrencySelector = ({ id }: { id: string }) => (<>
  <label htmlFor={id} className="sr-only">
    Currency
  </label>
  <div className="
    group relative -ml-2
    rounded-md border-transparent
    focus-within:ring-2
    focus-within:ring-dracula-purple
  ">
    <select
      id={id}
      name="currency"
      className="
        py-0.5 pl-2 pr-5
        flex items-center
        bg-none
        bg-white lg:bg-dracula-purple
        group-hover:bg-dracula-purple lg:group-hover:bg-dracula-purple
        text-sm font-medium
        text-smoke-900
        group-hover:text-white lg:group-hover:text-white
        rounded-md border-transparent
        focus:border-transparent focus:outline-none focus:ring-0
    ">
      {currencies.map((currency) => (
        <option key={currency}>{currency}</option>
      ))}
    </select>
    <div className="
      pointer-events-none absolute inset-y-0 right-0 flex items-center
    ">
      <ChevronDownIcon aria-hidden="true" className="
        h-5 w-5 text-smoke-900
        group-hover:text-white lg:group-hover:text-white
      "/>
    </div>
  </div>
</>)

const CurrencySelectorSm = () => (
  <form>
    <div className="inline-block">
      <_CurrencySelector id="mobile-currency" />
    </div>
  </form>
)

const CurrencySelectorLg = () => (
  <form className="hidden lg:block lg:flex-1">
    <div className="flex">
      <_CurrencySelector id="desktop-currency" />
    </div>
  </form>
)

export default function CurrencySelector ({ size }: { size: 'sm' | 'lg' }) {
  return (<>
    {
      size === 'sm'
        ? <CurrencySelectorSm />
        : <CurrencySelectorLg />
    }
  </>)
}
