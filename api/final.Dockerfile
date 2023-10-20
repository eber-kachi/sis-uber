# instalando dependencias en dep
FROM node:18-alpine as deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# para empaquetar 
FROM node:18-alpine as builder
WORKDIR /app
#copiamos de deps  a la nueva imagen node modules  
COPY --from=deps /app/node_modules ./node_modules

COPY . .
RUN yarn build

FROM node:18-alpine as runner
WORKDIR /app

COPY package.json yarn.lock  ./
# RUN yarn install --production && rm -rf ~/.cache/*
RUN yarn install --prod

COPY --from=builder /app/dist ./dist

CMD [ "node", "dist/main" ]

#  docker build -f final.Dockerfile  -t nest-rest-api .