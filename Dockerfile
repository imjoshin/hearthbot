FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]