FROM node:18

WORKDIR /usr/src/auth

COPY package*.json ./

RUN npm install

COPY .. .

EXPOSE 4001

CMD ["npm", "start"]

