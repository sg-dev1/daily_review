#FROM nginx:1.25.2-alpine3.18
FROM nginx:1.27.2-alpine3.20

RUN mkdir -p /etc/nginx/conf.d/
RUN mkdir -p /etc/nginx/ssl
COPY rproxy/default.conf  /etc/nginx/conf.d/
