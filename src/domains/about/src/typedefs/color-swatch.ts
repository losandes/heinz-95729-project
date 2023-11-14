import { z } from 'zod'

export const colorSwatch = z.object({
  name: z.string()
    .describe('The name of the color swatch'),
  bg: z.string()
    .describe('the CSS classes that will be used to preview the colors'),
  hex: z.string()
    .describe('the CSS hex value for the color'),
}).readonly().describe('A single color used in a color palette')

export type colorSwatch = z.infer<typeof colorSwatch>

export default colorSwatch
