import TopNav from '../_organisms/TopNav'
import PrimaryNavLg from '../_organisms/PrimaryNavLg'
import PrimaryNavSm from '../_organisms/PrimaryNavSm'

export default function Example() {
  return (
    <div className="bg-white">
      <PrimaryNavSm />
      <header className="relative">
        <nav aria-label="Top">
          <TopNav />
          <PrimaryNavLg />
        </nav>
      </header>
    </div>
  )
}
