# FROM node:18-alpine AS deps
# RUN apk add --no-cache libc6-compat
# WORKDIR /app

# # COPY ./package.json ./package-lock.json ./
# # COPY ./package.json ./
# # COPY package*.json ./
# # RUN npm config set fetch-retry-mintimeout 20000
# # RUN npm config set fetch-retry-maxtimeout 120000
# # RUN npm i -g yarn 
# COPY package.json yarn.lock ./

# RUN yarn install --frozen-lockfile
# # RUN  npm install --production

# FROM node:18-alpine AS builder

# WORKDIR /app

# # COPY --chown=node:node package.json package.json yarn.lock ./
# COPY --from=deps  /app/package.json package.json yarn.lock ./
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN yarn build

# FROM node:18-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json /app/yarn.lock ./

# USER nextjs

# EXPOSE 3000

# ENV PORT 3000

# CMD ["npm", "start"]

FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY ./package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# RUN \
#   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#   elif [ -f package-lock.json ]; then npm ci; \
#   elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
#   else echo "Lockfile not found." && exit 1; \
#   fi
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --frozen-lockfile
RUN yarn install --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/server ./.next/server
COPY --from=builder --chown=nextjs:nodejs /app/.next/cache ./.next/cache
COPY --from=builder --chown=nextjs:nodejs /app/ ./
RUN yarn build
# USER nextjs
EXPOSE 3000
ENV PORT 3000
# CMD ["node", "server.js"]
CMD ["yarn", "start"]