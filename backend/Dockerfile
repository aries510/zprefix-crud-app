FROM node:alpine

WORKDIR /server

COPY . /server

EXPOSE 8080

RUN npm install

CMD [ "npm", "start" ]