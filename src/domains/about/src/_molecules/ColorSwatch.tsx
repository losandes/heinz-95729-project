import { type ReactEventHandler, useState } from 'react'
import { concatToOneLine } from '@lib/react-utils'
import type { colorSwatch } from '../typedefs/color-swatch'

const ColorSwatchComponent = ({
  swatch
}: Readonly<{ swatch: colorSwatch }>) => {
  const [hintVisibility, setHintVisibility] = useState('hidden')

  const copyClassName: ReactEventHandler = (event) => {
    event.preventDefault()

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigator.clipboard.writeText(swatch.bg)
    setHintVisibility('')

    setTimeout(() => { setHintVisibility('hidden') }, 2700)
  }

  return (
    <div className="relative flex">
      <div className="space-y-1.5">
        <button
          type="button"
          className="cursor-pointer"
          onClick={copyClassName}
          aria-label="Copy color to clipboard"
        >
          <span className={concatToOneLine([
            hintVisibility,
            `absolute
            group-hover:flex
            w-20 px-2 py-1 -left-3.5 md:left-0.5 -top-2
            -translate-y-full
            bg-cyan-500
            text-sm text-center text-white
            rounded-md
            after:content-['']
            after:absolute
            after:left-1/2
            after:top-[100%]
            after:-translate-x-1/2
            after:border-8
            after:border-x-transparent
            after:border-b-transparent
            after:border-t-cyan-500`,
          ])}>
            Copied!
          </span>
          <div className={concatToOneLine([
            swatch.bg,
            `h-10 w-full
            rounded dark:ring-1 dark:ring-inset dark:ring-white/10`,
          ])}>
          </div>
          {/* <!--
            this invisible div is a bit of a hack to get the
            block to fit the text elements, while still being
            able to select and copy the text. The "actual text
            display" is _after_ the button
          --> */}
          <div className="
            invisible
            -mt-8 md:-mt-4
            px-0.5
            2xl:block
            md:flex md:justify-between
            md:space-x-2 2xl:space-x-0"
          >
            <div className="
              font-medium
              w-6  2xl:w-full
              text-slate-900 dark:text-white"
            >
              {swatch.name}
            </div>
            <div className="
              font-mono lowercase
              text-slate-500 dark:text-slate-400"
            >
              {swatch.hex}
            </div>
          </div>
        </button>
        {/* <!-- actual text display --> */}
        <div className="
          px-0.5
          2xl:block
          md:flex md:justify-between
          md:space-x-2 2xl:space-x-0"
        >
          <div className="
            font-medium
            w-6  2xl:w-full
            text-slate-900 dark:text-white"
          >
            {swatch.name}
          </div>
          <div className="
            font-mono lowercase
            text-slate-500 dark:text-slate-400"
          >
            {swatch.hex}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorSwatchComponent
