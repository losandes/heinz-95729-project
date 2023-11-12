import { Route, Routes } from 'react-router-dom'
import Home from '@pages/index'
import { transformPages, type Pages } from './transform-pages'

export default function Router ({ pages }: { pages: Pages }) {
  const transformed = transformPages(pages)

  return (
    <Routes>
      {transformed.map(([path, Element]) => (
        <Route key={path} path={path} element={<Element.default />}></Route>
      ))}
      <Route path={'/'} element={<Home />}></Route>
    </Routes>
  )
}
