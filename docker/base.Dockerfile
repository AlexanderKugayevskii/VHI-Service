FROM node:latest
RUN mkdir -p /var/www/
# RUN npm i -g quasar-cli@0.6.5
WORKDIR /var/www
COPY package.json .
RUN npm install