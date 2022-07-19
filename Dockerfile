# Stage 0: Install the base dependancies
FROM node:16.15-alpine@sha256:c785e617c8d7015190c0d41af52cc69be8a16e3d9eb7cb21f0bb58bcfca14d6b AS dependencies

# Metadata about your image
LABEL maintainer="Anastasia Khomochkina" \
    description="Fragments-ui node.js microservice"

# We default to use port 8080 in our service
ENV PORT=1234 \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false \
    NODE_ENV=production

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json .env ./

# Install node dependencies defined in package-lock.json
RUN npm ci

#################################################################################

# Stage 1: 
FROM node:16.15-alpine@sha256:c785e617c8d7015190c0d41af52cc69be8a16e3d9eb7cb21f0bb58bcfca14d6b AS builder

WORKDIR /app

COPY --from=dependencies /app /app

COPY . .

RUN npm run build

#################################################################################

# Stage 2: 
FROM nginx:stable-alpine@sha256:0a88a14a264f46562e2d1f318fbf0606bc87e72727528b51613a5e96f483a0f6 AS deploy

COPY --from=builder /app/dist/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=30s --start-period=10s --retries=3 \
    CMD curl --fail localhost:80 || exit 1
