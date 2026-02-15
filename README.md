# 🌳 OurTree Offline Library

A standalone, local-first digital library designed for the Raspberry Pi 5. This system broadcasts its own Wi-Fi hotspot to serve a custom React/Vite web application to any connected device without requiring internet access.

---

## 🚀 Features
- **Standalone Hotspot**: Broadcasts a private Wi-Fi network named `OurTree_Library`.
- **Zero-Touch Updates**: Uses **Docker Watchtower** to automatically pull new design updates from Docker Hub whenever internet is momentarily provided.
- **Automatic Routing**: Custom Lighttpd configuration redirects users from the gateway IP directly to the library interface.
- **Optimized for Pi 5**: Built using a 64-bit architecture for maximum performance.

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS.
- **Containerization**: Docker & Docker Compose.
- **OS/Networking**: RaspAP (Debian-based).
- **Web Servers**: Nginx (App) & Lighttpd (Redirects).

---

## 📂 Project Structure & Code

### 1. Docker Configuration (`Dockerfile`)
Uses a multi-stage build to keep the final image size under 25MB.
```dockerfile
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


docker buildx create --name pi-builder --use --bootstrap
docker buildx build --platform linux/arm64 -t ayechan279/ourtree-library:latest --push .

curl -sSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

mkdir ~/ourtree-library && cd ~/ourtree-library

cat <<EOF > docker-compose.yml
services:
  library:
    image: ayechan279/ourtree-library:latest
    ports:
      - "8080:80"
    restart: always

  updater:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 3600 --cleanup
    restart: always
EOF
docker compose up -d


sudo nano /etc/lighttpd/lighttpd.conf
$HTTP["host"] =~ "10.3.141.1" {
    url.redirect = ( "^/$" => "http://10.3.141.1:8080" )
}
sudo systemctl restart lighttpd

sudo sed -i 's/ssid=RaspAP/ssid=OurTree_Library/' /etc/hostapd/hostapd.conf
sudo systemctl restart hostapd