import { create } from 'zustand'
import colorPalette from '../typedefs/color-palette'

type ColorPaletteStore = Readonly<{
  palettes: Readonly<colorPalette[]>
}>

export const usePaletteStore = create<ColorPaletteStore>()(() => ({
  palettes: [],
}))

export default usePaletteStore
