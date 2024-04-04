ARG REGISTRY_URL
ARG IMAGE_PREFIX
FROM ${REGISTRY_URL}/${IMAGE_PREFIX}:base as BUILD
RUN mkdir -p /var/www/
WORKDIR /var/www
COPY . .
RUN npm run build

FROM nginx:alpine 
WORKDIR /var/www
COPY --from=BUILD /var/www/dist/spa ./
