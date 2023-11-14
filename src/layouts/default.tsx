import { type PropsWithChildren } from 'react'
import { Header } from '@domains/header'
import './default.css'
import useTestSession from '@domains/profile/src/_templates/use-test-session-hook'

const Prose = ({ children }: Readonly<PropsWithChildren>) => (
  <div className="
    w-full h-full

    prose max-w-none
    prose-smoke dark:prose-invert

    prose-h1:font-black prose-h1:text-5xl prose-h1:my-4
    prose-h2:font-extralight prose-h2:text-4xl prose-h2:my-4
    prose-h3:font-thin prose-h3:text-3xl prose-h3:my-2
    prose-h4:font-thin prose-h4:text-2xl prose-h4:my-2
    prose-h5:text-brand-cyan prose-h5:my-2
    prose-code:text-dracula-pink
  ">
    {children}
  </div>
)

export default function DefaultLayout ({ children }: Readonly<PropsWithChildren>) {
  const [isAuthenticated, testErr, testLoading, testStatus] = useTestSession()

  return (<>
    <div className="light">
      <Header />
      <main>
        <Prose>
          {children}
        </Prose>
      </main>
    </div>
  </>)
}
