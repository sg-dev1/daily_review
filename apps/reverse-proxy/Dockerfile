FROM nginx:1.27.2-alpine3.20

RUN mkdir -p /etc/nginx/conf.d/
RUN mkdir -p /etc/nginx/ssl
COPY apps/reverse-proxy/config/default.conf  /etc/nginx/conf.d/
