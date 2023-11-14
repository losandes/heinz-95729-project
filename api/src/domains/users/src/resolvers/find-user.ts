import type userSchema from '../typedefs/user'

type getUsersBy = {
  id: (id: string) => Promise<userSchema | undefined>
  email: (email: string) => Promise<userSchema | undefined>
}

export const find = (
  { getBy }: { getBy: getUsersBy }
) => async (
  query: { id?: string, email?: string }
) => {
  if (typeof query?.id === 'string') {
    const user = await getBy.id(query.id)
    return user ? [user] : []
  } else if (query?.email === 'string') {
    const user = await getBy.email(query.email)
    return user ? [user] : []
  } else {
    return []
  }
}

export default find
