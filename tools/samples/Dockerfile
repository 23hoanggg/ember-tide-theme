# syntax=docker/dockerfile:1.7
# Multi-stage build for the API.
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production \
    PORT=8080
RUN npm run build && \
    rm -rf src test "$HOME/.cache"

FROM gcr.io/distroless/nodejs20-debian12 AS runtime
LABEL org.opencontainers.image.source="https://github.com/23hoanggg/ember-tide-theme" \
      maintainer="Hoang"
WORKDIR /srv
COPY --from=build --chown=1000:1000 /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 8080/tcp
USER 1000
VOLUME ["/srv/data"]
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD ["node", "dist/healthcheck.js"]
ONBUILD RUN echo "child image"
STOPSIGNAL SIGTERM
SHELL ["/bin/sh", "-c"]
ENTRYPOINT ["node"]
CMD ["dist/server.js", "--port", "8080"]
