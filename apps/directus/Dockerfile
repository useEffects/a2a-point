FROM directus/directus:10.11.2

WORKDIR /directus

COPY .env .env
COPY extensions extensions
COPY snapshot.yaml snapshot.yaml

ARG DB_CLIENT
ARG DB_HOST
ARG DB_PORT
ARG DB_DATABASE
ARG DB_USER
ARG DB_PASSWORD

# Expose the Directus port
EXPOSE 8055

RUN npx directus bootstrap
CMD ["npx", "directus", "start"]




