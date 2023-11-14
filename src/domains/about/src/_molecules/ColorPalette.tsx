import { concatToOneLine } from '@lib/react-utils'
import type { colorPalette } from '../typedefs/color-palette'
import type { colorSwatch } from '../typedefs/color-swatch'
import ColorSwatchComponent from './ColorSwatch'

const ColorPaletteComponent = ({
  name = '',
  nameColor = 'text-slate-900 dark:text-slate-200',
  palette = [],
}: colorPalette) => {
  return (
    <div className="
      flex flex-col sm:flex-row
      space-y-3 sm:space-y-0 sm:space-x-4
      text-xs
      mb-4 md:mb-12
    ">
      <div className="w-16 shrink-0">
        <div className="h-10 flex flex-col justify-center">
          <div className={concatToOneLine([nameColor, 'font-semibold text-s'])}>
            {name}
          </div>
        </div>
      </div>
      <div className="
        min-w-0
        flex-1
        grid grid-cols-5 2xl:grid-cols-10
        gap-x-4 gap-y-3 2xl:gap-x-2
      ">
        {palette.map((swatch: colorSwatch) =>
          <ColorSwatchComponent key={name + '-' + swatch.name} swatch={swatch} />,
        )}
      </div>
    </div>
  )
}

export default ColorPaletteComponent
