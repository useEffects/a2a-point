FROM node:20-bullseye

RUN apt-get update && \
    apt-get install -y curl wget jq openssl python3 python3-pip&& \
    apt-get clean
RUN pip3 install requests

WORKDIR /app
COPY package.json .
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

WORKDIR /app/apps/www
RUN yarn install
# RUN yarn build
# RUN yarn start

EXPOSE 3000

CMD ["sh", "-c", "python3 /app/scripts/init-scripts/directus/update-tokens.py && yarn build && yarn start"]