FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# exposes port 8080 of the application to localhost:80
EXPOSE 8080

CMD npm start