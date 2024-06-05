FROM node:18-slim AS builder

WORKDIR /app
COPY . .
RUN yarn install
WORKDIR /app/apps/keycloak-theme
RUN yarn build
RUN yarn build:jar


FROM quay.io/keycloak/keycloak:latest

WORKDIR /opt/keycloak
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore
RUN /opt/keycloak/bin/kc.sh build
COPY --from=builder /app/apps/keycloak-theme/out/keywind.jar /opt/keycloak/providers/
COPY scripts/docker-init-scripts/keycloak-init.sh /usr/local/bin/

ENTRYPOINT ["/usr/local/bin/keycloak-init.sh"]

