FROM node:lts-bullseye AS build

ARG BOT_GITEA_TOKEN

WORKDIR /app

COPY package.json yarn.lock .yarnrc .yarnrc.yml ./
COPY .yarn/releases/yarn-4.5.3.cjs ./.yarn/releases/yarn-4.5.3.cjs
RUN yarn set version berry
RUN yarn install

WORKDIR /app/packages/tailwind-theme
COPY packages/tailwind-theme/package.json .
RUN yarn install

WORKDIR /app/packages/app
COPY packages/app/package.json .
RUN yarn install

WORKDIR /app/apps/www
COPY apps/www/package.json .
RUN yarn install

WORKDIR /app
COPY . .

WORKDIR /app/apps/www
RUN yarn install
RUN yarn build

FROM node:lts-bullseye

WORKDIR /app

COPY --from=build /app/apps/www/.next /app/.next
COPY --from=build /app/apps/www/public /app/.next/standalone/apps/www/public
COPY --from=build /app/apps/www/.next/static /app/.next/standalone/apps/www/.next/static

EXPOSE 3000

CMD ["sh", "-c", "node .next/standalone/apps/www/server.js"]
