FROM node:18-bullseye-slim as node
RUN npm i -g pm2
WORKDIR /a2apoint
COPY package.json /a2apoint
RUN yarn install
COPY . /a2apoint
WORKDIR /a2apoint/apps/www
RUN yarn install
RUN yarn build
RUN pm2 start yarn --name www -- start

FROM nginx as nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]