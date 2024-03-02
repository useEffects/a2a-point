# Build the theme config
FROM maven:3.8.3-openjdk-11 AS theme-builder

RUN apt-get install -y curl \
    && curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && curl -L https://www.npmjs.com/install.sh | sh

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run keycloak

# Build the keycloak server
FROM quay.io/keycloak/keycloak:latest as builder

WORKDIR /opt/keycloak
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:latest
COPY --from=theme-builder app/build_keycloak/src/main/resources/theme/keycloak-theme /opt/keycloak/themes/keycloak-theme
COPY --from=builder /opt/keycloak/ /opt/keycloak/

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]