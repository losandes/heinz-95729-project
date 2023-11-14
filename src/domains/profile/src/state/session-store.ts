import { create } from 'zustand'

type SessionStore = Readonly<{
  isAuthenticated: boolean
}>

export const useSessionStore = create<SessionStore>()(() => ({
  isAuthenticated: false,
}))

export default useSessionStore
