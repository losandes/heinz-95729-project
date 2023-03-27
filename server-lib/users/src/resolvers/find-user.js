/**
 * @param {{ getBy: IResolveUsers['getBy'] }} getters
 * @returns {IResolveUsers['find']}
 */
export const find = ({ getBy }) => async (query) => {
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
