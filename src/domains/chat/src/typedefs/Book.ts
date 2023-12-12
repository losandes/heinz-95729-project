import { z } from 'zod';

export const Book=z.object({
  title:z.string().nullish(),
  cover:z.string().nullish(),
  description:z.string().nullish(),
  checkout: z.string().nullish(),
  price:z.number().nullish(),
  rating:z.number().nullish()
}).readonly()


export type Book= z.infer<typeof Book>
