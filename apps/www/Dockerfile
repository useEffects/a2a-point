FROM node:lts-bullseye

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install

RUN mkdir -p apps/www
COPY apps/www/package.json /app/apps/www
WORKDIR /app/apps/www
RUN yarn install

WORKDIR /app
RUN mkdir -p packages/app
COPY packages/app/package.json /app/packages/app
WORKDIR /app/packages/app
RUN yarn install

WORKDIR /app
RUN mkdir -p packages/tailwind-theme
COPY packages/tailwind-theme/package.json /app/packages/tailwind-theme
WORKDIR /app/packages/tailwind-theme
RUN yarn install

WORKDIR /app
COPY . .


EXPOSE 3000

CMD ["sh", "-c", "yarn build && yarn start"]