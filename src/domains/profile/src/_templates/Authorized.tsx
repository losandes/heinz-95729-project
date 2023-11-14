import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useTestSession from './use-test-session-hook'

export default function Authorized () {
  const navigate = useNavigate()
  const [isAuthenticated, testErr, testLoading, testStatus] = useTestSession()

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate('/')
    }
  })

  return (<>
    {
      testErr && <>
        <p className="text-red-400">
          {testErr.message}
        </p>
        <Link to="/profile/login" className="
          font-semibold leading-6
          text-brand-violet hover:text-dracula-purple
        ">
          Try to sign in again
        </Link>
      </>
    }
    {
      testLoading &&
        <p className="text-brand-green">
          {testStatus}...
        </p>
    }
  </>)
}
