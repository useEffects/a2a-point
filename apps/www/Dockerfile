FROM node:lts-bullseye

RUN yarn set version berry

WORKDIR /app
COPY . .
RUN yarn install

WORKDIR /app/apps/www

EXPOSE 3000

CMD ["sh", "-c", "yarn build && yarn start"]