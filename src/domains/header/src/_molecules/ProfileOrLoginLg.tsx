import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useSessionStore } from '@domains/profile'

type StyledLinkProps = { to: string, children: ReactNode }

const StyledLink = ({ to, children }: StyledLinkProps) => (
  <Link to={to} className="
    text-sm font-medium text-smoke-900 hover:text-white
  ">
    {children}
  </Link>
)

const SignedInHeader = () => (<StyledLink to="/profile/">Account</StyledLink>)
const SignedOutHeader = () => (<>
  <StyledLink to="/profile/register/">Create an account</StyledLink>
  <span className="h-6 w-px bg-smoke-600" aria-hidden="true" />
  <StyledLink to="/profile/login/">Sign in</StyledLink>
</>)

export default function AuthHeader () {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)

  return (
    <div className="
        hidden
        lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6
    ">
      {isAuthenticated ? <SignedInHeader /> : <SignedOutHeader />}
    </div>
  )
}
