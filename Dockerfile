# STAGE 1: Build
FROM node:20-alpine AS build-stage
WORKDIR /app

# Copy package files first to speed up builds
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Run the Vite build command
RUN npm run build

# STAGE 2: Use OpenResty (Nginx + Lua)
FROM openresty/openresty:alpine

# Install wget so the sync script can download files
RUN apk add --no-cache wget bash

# Copy the build output from Stage 1
COPY --from=build-stage /app/dist /usr/local/openresty/nginx/html

# Copy your specific nginx.conf to OpenResty's config path
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the sync script and make it executable
COPY sync_library.sh /usr/local/bin/sync-books
RUN chmod +x /usr/local/bin/sync-books

EXPOSE 80