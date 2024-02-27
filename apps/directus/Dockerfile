FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8055

CMD ["sh", "-c", "npx directus bootstrap && npm run start"]

