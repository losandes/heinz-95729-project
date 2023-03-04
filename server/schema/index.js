import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import * as resolvers from './resolvers/index.js'

/**
 *
 * @param {IAppContext} context
 * @returns
 */
export default async function loadTypeDefs ({ logger, env }) {
  logger.emit('before_load_schema', 'trace', { cwd: process.cwd() })
  const schema = await loadSchema(
    env.PATH_TO_GRAPHQL_SCHEMA,
    { loaders: [new GraphQLFileLoader()] },
  )

  logger.emit('before_add_resolvers_to_schema', 'trace')

  const schemaWithResolvers = addResolversToSchema({ schema, resolvers })

  logger.emit('schema_prepared', 'trace')

  return schemaWithResolvers
}
