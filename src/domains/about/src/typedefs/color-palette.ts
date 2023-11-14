import colorSwatch from './color-swatch'
import { z } from 'zod'

export const colorPalette = z.object({
  name: z.string()
    .describe('The name of the color palette'),
  nameColor: z.string()
    .describe('the CSS classes that will be used to display the palette header'),
  palette: z.array(colorSwatch),
}).readonly().describe('A collection of colors')

export type colorPalette = z.infer<typeof colorPalette>

export default colorPalette
