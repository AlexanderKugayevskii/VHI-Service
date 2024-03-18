ARG REGISTRY_URL
FROM ${REGISTRY_URL}/dms-service/frontend:base as BUILD
RUN mkdir -p /var/www/
WORKDIR /var/www
COPY . .
RUN npm run build

FROM nginx:alpine 
WORKDIR /var/www
COPY --from=BUILD /var/www/dist/spa ./
