import { create } from 'zustand'

export type CartStore = Readonly<{
  count: number
}>

export const useCartStore = create<CartStore>()(() => ({
  count: 0,
}))

export default useCartStore
