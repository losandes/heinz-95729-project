import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useSessionStore } from '@domains/profile'

type StyledLinkProps = { to: string, children: ReactNode }

const StyledLink = ({ to, children }: StyledLinkProps) => (
  <Link to={to} className="
    -m-2 block p-2 font-medium
    text-gray-900 hover:text-dracula-purple
  ">
    {children}
  </Link>
)

const SignedInHeader = () => (<StyledLink to="/profile/">Account</StyledLink>)
const SignedOutHeader = () => (<>
  <div className="flow-root">
    <StyledLink to="/profile/register/">Create an account</StyledLink>
  </div>
  <div className="flow-root">
    <StyledLink to="/profile/login/">Sign in</StyledLink>
  </div>
</>)

export default function AuthHeader () {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)

  return (
    <div className="space-y-6 border-t border-gray-200 px-4 py-6">
      {isAuthenticated ? <SignedInHeader /> : <SignedOutHeader />}
    </div>
  )
}
