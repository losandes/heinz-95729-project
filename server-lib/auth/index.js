import authorizeModule from './src/middleware/authorize.js'
import deauthorizeModule from './src/middleware/deauthorize.js'
import loginModule from './src/middleware/login.js'
import logoutModule from './src/middleware/logout.js'
import requireSessionModule from './src/middleware/require-session.js'
import testSessionModule from './src/middleware/test-session.js'
import verifySessionModule from './src/middleware/verify-session.js'
import SessionModule from './src/typedefs/Session.js'

export const authorize = authorizeModule
export const deauthorize = deauthorizeModule
export const login = loginModule
export const logout = logoutModule
export const requireSession = requireSessionModule
export const testSession = testSessionModule
export const verifySession = verifySessionModule
export const Session = SessionModule

export default {
  authorize,
  deauthorize,
  login,
  logout,
  requireSession,
  testSession,
  verifySession,
  Session,
}
