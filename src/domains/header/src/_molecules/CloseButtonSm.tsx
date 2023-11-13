import { XMarkIcon } from '@heroicons/react/24/outline'
import useNavStore from '../state/nav-store'

export default function CloseButtonSm () {
  const closeMenu = () => useNavStore.setState({
    ...useNavStore.getState(),
    ...{ open: false }
  })

  return (
    <div className="flex px-4 pb-2 pt-5">
      <button
        type="button"
        onClick={closeMenu}
        className="
          -m-2 p-2 inline-flex items-center justify-center
          rounded-md
          text-smoke-900 hover:text-dracula-purple
      ">
        <span className="sr-only">Close menu</span>
        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  )
}
