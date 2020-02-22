FROM node:13.6.0-alpine3.11

WORKDIR /usr/src/app

COPY . .

RUN npm install

# expose port 3000 of the application to localhost:80
EXPOSE 80
EXPOSE 443

CMD npm start