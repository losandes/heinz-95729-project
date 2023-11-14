import { z } from 'zod'
import { useFetch } from '@lib/fetch'
import useSessionStore from '../state/session-store'
import type { HttpError } from '@lib/errors'
import type { SettlementKey } from '@lib/fetch/src/use-fetch-hook'

export const testSchema = z.object({
  authenticated: z.boolean()
})

export default function useTestSession (): [
  boolean,
  Error | HttpError | undefined,
  boolean,
  SettlementKey,
] {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  const [testErr, testLoading, testStatus] = useFetch(
    '/api/session/test',
    testSchema,
    (data) => {
      useSessionStore.setState({ isAuthenticated: data.authenticated })
    })

  return [isAuthenticated, testErr, testLoading, testStatus]
}
