FROM node:lts

WORKDIR /app

COPY . /app

RUN npm i bcrypt joi jsonwebtoken moment mysql2 swagger-jsdoc swagger-ui-express typeorm ts-node

CMD [ "npm", "run", "start"]