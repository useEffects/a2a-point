FROM node:lts-bullseye

RUN yarn set version berry

WORKDIR /app
COPY . .
RUN yarn install

WORKDIR /packages/tailwind-theme
RUN yarn install

WORKDIR /packages/app
RUN yarn install

WORKDIR /app/apps/www
RUN yarn install

EXPOSE 3000

CMD ["sh", "-c", "yarn build && yarn start"]