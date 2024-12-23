FROM node:lts-bullseye

ARG BOT_GITEA_TOKEN

WORKDIR /app
COPY . .
ENV BOT_GITEA_TOKEN=${BOT_GITEA_TOKEN}
RUN yarn install

EXPOSE 3000

WORKDIR /app/apps/www

CMD ["sh", "-c", "yarn build && yarn start"]