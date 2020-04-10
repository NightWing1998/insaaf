# build phase
FROM node:13.6.0-alpine3.11 as build
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build

# serve build using nginx
FROM nginx:1.17.8-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/default.conf /etc/nginx/conf.d
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
