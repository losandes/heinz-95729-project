import { createId } from '@paralleldrive/cuid2'
import Keyv from 'keyv'
import { makeInspectableLogger } from '../inspectable-logger.js'

/**
 * @param {IMockKoaContextStateOptions} [options]
 * @returns {IKoaContextState}
 */
export const makeMockKoaContextState = (options) => {
  return {
    ...{
      affinityTime: Date.now(),
      affinityId: createId(),
      method: 'GET',
      url: 'http://localhost:3001/api/login',
      origin: 'http://localhost:3001',
      maybeProxiedOrigin: 'http://localhost:3001/api',
      logger: makeInspectableLogger(),
      storage: {
        users: new Keyv(),
        products: new Keyv(),
      },
      resolvers: {},
      session: {
        id: 'v577a2dcm0tevr6qronbr6zf',
        user: {
          id: 'efeqrhg1yq1r0j35jbypt4dt',
          email: 'testy@example.com',
          name: 'Testy Testerson',
        },
      },
      env: {
        NODE_ENV: 'test',
        NODE_ENV_ENFORCE_SECURITY: false,
        SERVER_VERSION: '0.1.0',
        SERVER_PORT: 3001,
        SERVER_PROXY_PREFIX: '/api',
        SERVER_IS_IN_PROXY: true,
        SERVER_ORIGIN: 'http://localhost:3000',
        CLIENT_ORIGIN: 'http://localhost:3001',
        SESSIONS_COOKIE_NAME: 'h95729',
        SESSIONS_ALGORITHM: 'HS256',
        SESSIONS_SECRETS: [{
          KID: 'uz1gv5mzrv8urqpfh0k68x7e18cryt5e',
          SECRET: 'gct89adq0z68oiay2vpwk4xcdpacbby8',
        }, {
          KID: 'ja5a2r0ijrwar2929f2ez33nh7r57gdq',
          SECRET: 'oqat0yi6ftz0gts4ungvatraoj61t189',
          EXPIRATION: Date.now() + (86400000 * 30) /* 30 days from now */,
        }],
        SESSIONS_EXPIRE_IN_MS: 86400000 * 30 /* 30 days */,
        SESSIONS_EXPIRE_IN_S: Math.floor((86400000 * 30) / 1000) /* 30 days */,
        LOG_WRITER: 'ArrayWriter',
        LOG_FORMATTER: 'PassThroughFormatter',
        LOG_EVENTS: ['*'],
        PATH_TO_KEYV_DB: 'data_volumes/heinz-95729.db',
        PATH_TO_GRAPHQL_SCHEMA: 'schema/schema.graphql',
      },
    },
    ...options,
  } // /state
}

export default makeMockKoaContextState
