FROM ubuntu:20.04

RUN apt-get update && apt-get install -y nginx curl && apt-get clean

RUN mkdir -p /app/ssl
COPY infra/nginx/certs/certificate_ca_bundle.cert /app/ssl
COPY infra/nginx/certs/private_key.pem /app/ssl

COPY infra/nginx/default.conf /etc/nginx/sites-enabled/default

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
