import { create } from 'zustand'

const pages = [
  {
    name: 'Books',
    href: '/products/books',
    imageSrc: '/images/menu/books.png',
    imageAlt: 'A woman facing the camera with an open book in her hands.',
  },
  {
    name: 'Music',
    href: '/products/music',
    imageSrc: '/images/menu/music.png',
    imageAlt: 'A young man facing the camera wearing headphones.',
  },
  {
    name: 'Movies',
    href: '/products/movies',
    imageSrc: '/images/menu/movies.png',
    imageAlt: 'A speeder bike flying across a desert landscape.',
  },
  {
    name: 'About',
    href: '/about',
    imageSrc: '/images/menu/about.png',
    imageAlt: 'A screenshot of the about page',
  },
]

type NavStore = Readonly<{
  open: boolean
  pages: typeof pages
}>

export const useNavStore = create<NavStore>()(() => ({
  open: false,
  pages,
}))

export const toggleOpen = () =>
  useNavStore.setState((state) => ({ open: !state.open }))

export default useNavStore
