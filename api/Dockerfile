FROM node:18-alpine As development
# WORKDIR /app

# ADD package.js /app/package.json
# RUN npm install --silent
# RUN npm run build

# ADD . /app

# EXPOSE 3001

# # CMD [ "npm",'run','start' ]
# CMD [ "node", "dist/main"]

WORKDIR /usr/src/app

# COPY --chown=node:node package*.json ./

# RUN npm install -g @nestjs/cli
# # Install app dependencies using the `npm ci` command instead of `npm install`
# RUN npm ci

# # Bundle app source
# COPY --chown=node:node . .

# # Use the node user from the image (instead of the root user)
# USER node
# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# RUN yarn build

FROM node:18-alpine As build


WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# RUN yarn build

ENV NODE_ENV production

RUN yarn build  && yarn cache clean

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/public ./public
COPY --chown=node:node --from=build /usr/src/app/report-template ./report-template

EXPOSE 3001

ENV PORT 3001

CMD [ "node", "dist/main.js" ]

# ENV NODE_ENV production
# USER node

# # Create app directory
# WORKDIR /usr/src/app

# # Install app dependencies
# COPY package.json yarn.lock ./

# RUN yarn install --production --frozen-lockfile

# COPY --from=builder /usr/src/app/dist ./dist

# CMD [ "node", "dist/main.js" ]







# # Bundle app source
# COPY --chown=node:node . .

# FROM node:18-alpine as production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install --only=production

# COPY . .

# COPY --from=development /usr/src/app/dist ./dist

# CMD ["node", "dist/main"]