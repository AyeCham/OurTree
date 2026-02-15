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

# STAGE 2: Serve
FROM nginx:alpine

# Copy the build output from Vite (usually 'dist')
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy your specific nginx.conf from the screenshot
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]