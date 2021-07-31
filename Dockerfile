# syntax=docker/dockerfile:1

FROM node:16-alpine

WORKDIR /app

COPY ["./app/package.json", "./app/package-lock.json", "./"]

RUN npm i

COPY ./app .

CMD ["node", "server.js"]
