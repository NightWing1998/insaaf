FROM nginx:1.17.8-alpine
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./server.crt /etc/ssl/certs/server.crt
COPY ./server.key /etc/ssl/certs/server.key

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]