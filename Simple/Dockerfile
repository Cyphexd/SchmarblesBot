FROM node:16-alpine
ENV NODE_ENV production

RUN apk update && apk upgrade
RUN apk add --no-cache dumb-init


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production


# Bundle app source
COPY --chown=node:node . .

USER node
CMD ["dumb-init", "node", "index.js"]