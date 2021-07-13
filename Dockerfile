# syntax=docker/dockerfile:1

FROM node:16-alpine

WORKDIR /app

COPY ./app .

CMD ["node", "app.js"]
