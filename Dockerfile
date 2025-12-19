# Build with node
FROM node:24.12-slim AS builder

WORKDIR /usr/app

COPY front/package*.json ./
RUN npm ci

COPY front .

RUN npm run build
     
# Serve with nginx unpprevileged
FROM httpd:alpine
RUN rm -r /usr/local/apache2/htdocs/*
COPY --from=builder /usr/app/dist/ /usr/local/apache2/htdocs/
COPY apache/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY apache/certs /usr/local/apache2/conf/certs
