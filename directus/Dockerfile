FROM node:lts-bullseye

RUN apt-get update && \
    apt-get install -y curl jq openssl python3 python3-pip wget && \
    apt-get clean
RUN pip3 install requests

WORKDIR /directus

# RUN yarn install
# RUN yarn add sharp --ignore-engines --ignore-workspace-root-check
COPY directus .
RUN mv prod.env .env

ARG PUBLIC_URL
ARG ADMIN_EMAIL
ARG ADMIN_PASSWORD
ARG DB_CLIENT
ARG DB_HOST
ARG DB_PORT
ARG DB_DATABASE
ARG DB_USER
ARG DB_PASSWORD
ARG KEY
ARG SECRET
ARG CLIENT_ID
ARG CLIENT_SECRET

ENV WEBSOCKETS_ENABLED=true
ENV WEBSOCKETS_REST_AUTH="strict"
# ENV LOG_LEVEL="warn"
ENV CACHE_ENABLED=true
ENV SESSION_COOKIE_NAME="directus_session_token"
ENV SESSION_COOKIE_DOMAIN="a2apoint.com"
ENV CORS_ENABLED=true
ENV CORS_ORIGIN="https://a2apoint.com/api/auth-redirect,https://dev.a2apoint.com/api/auth-redirect"
ENV EXTENSIONS_AUTO_RELOAD=true
ENV EMAIL_FROM="info@a2apoint.com"
ENV AUTH_PROVIDERS="keycloak"
ENV AUTH_KEYCLOAK_DRIVER="openid"
ENV AUTH_KEYCLOAK_MODE="session"
ENV AUTH_KEYCLOAK_IDENTIFIER_KEY="email"
ENV AUTH_KEYCLOAK_ALLOW_PUBLIC_REGISTRATION=true
ENV AUTH_KEYCLOAK_CLIENT_ID=${CLIENT_ID}
ENV AUTH_KEYCLOAK_CLIENT_SECRET=${CLIENT_SECRET}
ENV AUTH_KEYCLOAK_DEFAULT_ROLE_ID=d880f42a-09e6-401c-8bee-7be133b0d2fe
ENV AUTH_KEYCLOAK_ISSUER_URL=https://auth.a2apoint.com/realms/master/.well-known/openid-configuration
ENV AUTH_KEYCLOAK_REDIRECT_ALLOW_LIST="https://a2apoint.com/api/auth-redirect,https://dev.a2apoint.com/api/auth-redirect"
ENV DB_CLIENT=postgres
ENV DB_SSL__REJECT_UNAUTHORIZED=false

# added from args
ENV PUBLIC_URL=${PUBLIC_URL}
ENV ADMIN_EMAIL=${ADMIN_EMAIL}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}
ENV DB_CLIENT=${DB_CLIENT}
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_DATABASE=${DB_DATABASE}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV KEY=${KEY}
ENV SECRET=${SECRET}
ENV CLIENT_ID=${CLIENT_ID}
ENV CLIENT_SECRET=${CLIENT_SECRET}

EXPOSE 8055

# RUN npx --yes directus bootstrap
# RUN npx --yes directus schema apply --yes ./schema/snapshot.yaml
ENTRYPOINT [ "sh", "-c", "npx --yes directus@10.12 start" ]