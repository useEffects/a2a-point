FROM node:18-slim AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
RUN mkdir -p apps/keycloak
COPY apps/keycloak/package.json apps/keycloak/
WORKDIR /app/apps/keycloak
RUN yarn install
WORKDIR /app
COPY . .
WORKDIR /app/apps/keycloak
RUN yarn build
RUN yarn build:jar
WORKDIR /app


FROM quay.io/keycloak/keycloak:latest

WORKDIR /opt/keycloak
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore
RUN /opt/keycloak/bin/kc.sh build
COPY --from=builder /app/apps/keycloak/out/keycloak.jar /opt/keycloak/providers/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]