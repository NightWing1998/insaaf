FROM node:14.11.0-alpine3.12

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV PORT=8080
ENV NODE_ENV=PRODUCTION
# exposes port 8080 of the application to localhost:80
EXPOSE 8080

CMD npm start
