FROM node:latest
RUN mkdir -p /var/www/
WORKDIR /var/www
COPY package.json .
RUN npm install