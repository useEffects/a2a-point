# Build the theme config
FROM maven:3.8.3-openjdk-11 AS theme-builder

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
RUN curl -L https://www.npmjs.com/install.sh | sh

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN npm i -g yarn
RUN yarn install
COPY . .
RUN yarn build --scope keycloak

# Build the keycloak theme jar
FROM alpine:latest AS theme-jar-builder
WORKDIR /opt/keycloak
COPY --from=theme-builder /app/apps/keycloak/dist_keycloak/target/keycloakify-starter-keycloak-theme-6.1.1.jar /opt/keycloak/providers/keycloakify-starter-keycloak-theme-6.1.1.jar
COPY --from=theme-builder /app/apps/keycloak/dist_keycloak/src/main/resources/theme/account-v1 /opt/keycloak/themes/account-v1
COPY --from=theme-builder /app/apps/keycloak/dist_keycloak/src/main/resources/theme/keycloakify-starter /opt/keycloak/themes/custom-theme
COPY --from=theme-builder /app/apps/keycloak/dist_keycloak/src/main/resources/theme/keycloakify-starter_retrocompat /opt/keycloak/themes/keycloakify-starter_retrocompat

# Build the keycloak server
FROM quay.io/keycloak/keycloak:latest as builder
WORKDIR /opt/keycloak
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore
RUN /opt/keycloak/bin/kc.sh build

# Final image
FROM quay.io/keycloak/keycloak:latest
WORKDIR /opt/keycloak
COPY --from=theme-jar-builder /opt/keycloak/ /opt/keycloak/

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]
