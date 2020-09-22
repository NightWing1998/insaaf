FROM node:14.11.0-alpine3.12

WORKDIR /usr/src/app

COPY . .

RUN npm install

# expose port 3000 of the application to localhost:80
EXPOSE 3000

CMD npm start
