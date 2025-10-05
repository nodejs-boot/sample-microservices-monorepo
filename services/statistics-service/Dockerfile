# Build docker image:  docker build -f services/account-service/Dockerfile -t account-service .
# Check container filesystem: docker run -t -i account-service /bin/bash
# Run docker image: docker run --rm -it -p 41000:41000 account-service
############################

# ---------- Base Alpine image ----------
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV HUSKY=0
ENV CI=true
ENV NODE_ENV=production
ARG SERVICE_NAME=statistics-service
ENV SERVICE_NAME=$SERVICE_NAME

ARG APP_VERSION
ENV DD_VERSION=$APP_VERSION

WORKDIR /app

# ---------- Install turbo and pnpm globally ----------
FROM base AS build-base
COPY . .
RUN npm install -g pnpm turbo

# ---------- Install and Build ----------
FROM build-base AS build
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --ignore-scripts

RUN pnpm run build

# ---------- Create prod-pruned output ----------
FROM build AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
  pnpm install \
    --frozen-lockfile \
    --prod \
    --ignore-scripts

RUN pnpm --filter=@tech-insights/$SERVICE_NAME \
    --prod \
    --frozen-lockfile \
    --shamefully-hoist \
    --config.node-linker=hoisted \
    --ignore-scripts \
    deploy --legacy \
    pruned

# Remove optional deps + trim unnecessary files
RUN find pruned/node_modules/.pnpm -type f -name "package.json" \
    -exec grep -q '"optional": true' {} \; \
    -exec sh -c 'rm -rf "$(dirname {})"' \; \
 && find pruned/node_modules -type f \( \
    -name "*.md" -o -name "*.ts" -o -name "*.map" -o -name "test*" -o -name "*.d.ts" \
  \) -delete

# ---------- Final lightweight image ----------
FROM base AS runner

LABEL version=$APP_VERSION

# Copy only compiled app and production artifacts
COPY --from=prod-deps /app/pruned/node_modules ./node_modules
COPY --from=prod-deps /app/pruned/package.json ./package.json
COPY --from=build /app/services/${SERVICE_NAME}/dist ./dist
COPY datadog/tracer.js ./

RUN apk --no-cache add curl
RUN curl -o /etc/ssl/certs/global-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
RUN apk del curl

# Create non-root user
RUN chown -R 1000:1000 /app && chmod -R 775 /app
RUN chown -R 1000:1000 /tmp && chmod -R 775 /tmp
USER 1000

EXPOSE 41000
CMD ["node", "dist/server.js"]
