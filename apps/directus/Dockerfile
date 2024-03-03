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

CMD ["sh", "-c", "npx directus bootstrap && yarn start"]

