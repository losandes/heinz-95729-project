import useNavStore from '../state/nav-store'

export default function MenuItemsSm () {
  const pages = useNavStore((state) => state.pages)

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="grid grid-cols-2 gap-x-4 gap-y-10">
        {pages.map((item) => (
          <div key={item.name} className="group relative">
            <div className="
              aspect-h-1 aspect-w-1 overflow-hidden
              rounded-md bg-gray-100 group-hover:opacity-75
            ">
              <img src={item.imageSrc} alt={item.imageAlt} className="object-cover object-center" />
            </div>
            <a href={item.href} className="mt-6 block text-sm font-medium text-gray-900">
              <span className="absolute inset-0 z-10" aria-hidden="true" />
              {item.name}
            </a>
            <p aria-hidden="true" className="mt-1 text-sm text-smoke-500">
              Shop now
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
