#!/bin/bash

docker rm keycloak-testing-container || true

cd /home/aprilia/Projects/nodejs/a2a-point/apps/keycloak/build_keycloak

docker run \
   -p 8080:8080 \
   --name keycloak-testing-container \
   -e KEYCLOAK_ADMIN=admin \
   -e KEYCLOAK_ADMIN_PASSWORD=admin \
   -e JAVA_OPTS=-Dkeycloak.profile=preview \
   -v /home/aprilia/Projects/nodejs/a2a-point/apps/keycloak/build_keycloak/src/main/resources/theme/keycloak-theme:/opt/keycloak/themes/keycloak-theme:rw \
   -it quay.io/keycloak/keycloak:18.0.0 \
   start-dev
