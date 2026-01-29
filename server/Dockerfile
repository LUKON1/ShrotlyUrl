FROM node:18-alpine

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm install --production

COPY --chown=node:node . .

USER node

EXPOSE 3000

CMD ["npm", "run", "start"]