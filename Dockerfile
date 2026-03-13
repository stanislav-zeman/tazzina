# --- Build stage ---
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .

# Static private env vars must be present at build time
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG AUTH_SECRET
ARG AUTH_URL
ARG ORIGIN
ARG DATABASE_URL="postgresql://build:build@localhost/build"
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV AUTH_SECRET=$AUTH_SECRET
ENV AUTH_URL=$AUTH_URL
ENV ORIGIN=$ORIGIN
ENV DATABASE_URL=$DATABASE_URL

RUN pnpm build

# --- Runtime stage ---
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/build ./build
COPY migrations ./migrations
COPY docker ./docker

EXPOSE 8080

CMD ["/bin/sh", "/app/docker/entrypoint.prod.sh"]
