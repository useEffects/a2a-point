FROM node:18-slim AS builder

WORKDIR /app
COPY package.json .
RUN yarn install

RUN mkdir -p apps/keywind
COPY apps/keywind/package.json /app/apps/keywind
RUN yarn install

RUN mkdir -p packages/tailwind-theme
COPY packages/tailwind-theme/package.json /app/packages/tailwind-theme
RUN yarn install

COPY . .

WORKDIR /app/apps/keywind
RUN yarn build
RUN yarn build:jar

FROM keycloak/keycloak:25.0

ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_DATABASE
ARG KC_ADMIN_USERNAME
ARG KC_ADMIN_PASSWORD

ENV KC_DB=postgres
ENV KC_DB_URL_HOST=${DB_HOST}
ENV KC_DB_URL_PORT=${DB_PORT}
ENV KC_DB_URL_DATABASE=${DB_DATABASE}
ENV KC_DB_USERNAME=${DB_USERNAME}
ENV KC_DB_PASSWORD=${DB_PASSWORD}
ENV KC_ADMIN_USERNAME=${KC_ADMIN_USERNAME}
ENV KC_ADMIN_PASSWORD=${KC_ADMIN_PASSWORD}

ENV KC_HOSTNAME_URL=https://auth.a2apoint.com
ENV KC_PROXY_HEADERS=xforwarded
ENV KC_HOSTNAME_STRICT=false
ENV KC_HOSTNAME_STRICT_HTTPS=false
ENV KC_HTTP_ENABLED=true
ENV KC_HOSTNAME_DEBUG=true
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

WORKDIR /opt/keycloak
RUN /opt/keycloak/bin/kc.sh build
COPY --from=builder /app/apps/keywind/out/keywind.jar /opt/keycloak/providers/
COPY scripts/docker-scripts/keycloak-init.sh /usr/local/bin/

CMD [ "start" ]