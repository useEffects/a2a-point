FROM node:18-slim

WORKDIR /app
COPY package.json ./
RUN yarn install
COPY apps/directus/package.json ./apps/directus/
WORKDIR /app/apps/directus
RUN yarn install
RUN npm install --include=optional sharp #😒😒
WORKDIR /app
COPY . .
WORKDIR /app/apps/directus
EXPOSE 5000
RUN  apt-get update \
  && apt-get install -y wget \
  && rm -rf /var/lib/apt/lists/*

CMD ["sh", "-c", "npx directus bootstrap && yarn start"]

