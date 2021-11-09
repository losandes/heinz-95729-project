FROM node:16-stretch-slim as builder

# TODO: WIP - this doesn't work yet because it has some incomplete, or
# false assumptions about the build process for this app

# Test Build
# ------------------------------------------------------------------------------
WORKDIR /app

RUN npm install -g pnpm

COPY ./ ./
RUN pnpm recursive install --force --reporter=silent && \
    pnpm run lint && \
    pnpm run build:test && \
    pnpm run ci:test && \
    pnpm run build && \
    pnpm prune --prod

# Prod Build
# ------------------------------------------------------------------------------
FROM node:14-stretch-slim

COPY --from=builder --chown=node:node /app/node_modules /app/node_modules
COPY --from=builder --chown=node:node /app/dist /app/dist
COPY --from=builder --chown=node:node /app/src/lib /app/src/lib

# Disable setuid and setgid permissions
RUN find / -perm /6000 -type f -exec chmod a-s {} \; || true

USER node
WORKDIR /app
