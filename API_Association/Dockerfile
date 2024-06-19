FROM node:lts

WORKDIR /app

COPY ./src /app/src
COPY ./package.json /app
COPY ./tsconfig.json /app
COPY ./.env /app/

RUN npm install

CMD npm run start
