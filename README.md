# 🌳 OurTree Offline Library

> A standalone, local-first digital library system built on Raspberry Pi 5.  
> Broadcasts its own Wi-Fi hotspot and serves a React-based web application — fully offline.

---

## 📌 Overview

**OurTree Offline Library** transforms a Raspberry Pi 5 into a self-contained edge computing library server.

It:

- Creates a private Wi-Fi hotspot (`OurTree_Library`)
- Serves a Dockerized React application
- Automatically updates when internet is temporarily available
- Requires no continuous internet connection

Designed for:

- Rural education centers
- Disaster-response deployments
- Low-connectivity environments
- Community knowledge hubs

---

# 🏗️ System Architecture

Client Device  
↓  
Wi-Fi Hotspot (`OurTree_Library`)  
↓  
Lighttpd (Gateway Redirect)  
↓  
Docker Container  
↓  
Nginx (Serves React App)

---

# 💻 Operating System & Base Setup

## 🖥️ Base Operating System

OurTree runs on:

- :contentReference[oaicite:0]{index=0} (64-bit)
- Preconfigured with :contentReference[oaicite:1]{index=1}

---

## 📥 OS Installation (Using Raspberry Pi Imager)

The system is installed using:

- :contentReference[oaicite:2]{index=2}

### Steps

1. Open Raspberry Pi Imager  
2. Select:
   ```
   Choose OS → Other specific-purpose OS → RaspAP
   ```
3. Select SD card storage  
4. Flash image  
5. Insert SD card into Raspberry Pi 5 and boot  

---

## 📡 Default RaspAP Configuration

After boot:

Access dashboard:

```
http://10.3.141.1
```

Default credentials:

```
Username: admin
Password: secret
```

Update the following:

- SSID → `OurTree_Library`
- WPA2 Passphrase
- Country code
- Admin password

---

# 🐳 Docker Deployment

## 1️⃣ Install Docker

```bash
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

---

## 2️⃣ Build ARM64 Image

```bash
docker buildx create --name pi-builder --use --bootstrap
docker buildx build --platform linux/arm64 \
  -t <your-dockerhub-username>/ourtree-library:latest \
  --push .
```

---

## 3️⃣ Docker Compose Setup

```bash
mkdir ~/ourtree-library && cd ~/ourtree-library
nano docker-compose.yml
```

```yaml
services:
  library:
    image: <your-dockerhub-username>/ourtree-library:latest
    ports:
      - "8080:80"
    restart: always

  updater:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 3600 --cleanup
    restart: always
```

Start services:

```bash
docker compose up -d
```

---

# 🔀 Gateway Redirect (Lighttpd)

Edit configuration:

```bash
sudo nano /etc/lighttpd/lighttpd.conf
```

Add:

```conf
$HTTP["host"] =~ "10.3.141.1" {
    url.redirect = ( "^/$" => "http://10.3.141.1:8080" )
}
```

Restart:

```bash
sudo systemctl restart lighttpd
```

Now users connecting to Wi-Fi will automatically see the library interface.

---

# 📦 Dockerfile

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
```

---

# 🔄 Automatic Updates

Uses:

- :contentReference[oaicite:3]{index=3}

Features:

- Checks Docker Hub every 3600 seconds
- Pulls latest image automatically
- Restarts container safely
- Removes outdated images

Zero-touch update mechanism.

---

# 🛠️ Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS

## Infrastructure
- Docker
- Docker Compose
- :contentReference[oaicite:4]{index=4}
- :contentReference[oaicite:5]{index=5}
- :contentReference[oaicite:6]{index=6}

## Hardware
- Raspberry Pi 5 (ARM64)

---

# ⚡ Performance Notes

- Built using ARM64 multi-stage Docker build
- Final image size under 25MB
- Optimized for Raspberry Pi 5
- Designed for offline-first deployment

---

# 🎯 Vision

OurTree aims to:

- Deliver knowledge without internet dependency
- Enable digital education in disconnected regions
- Reduce reliance on cloud infrastructure
- Provide deployable edge-computing learning systems

---

# 👨‍💻 Author

Aye Chan Aung  
Technology & Data Science  
Mae Fah Luang University  

---

# 📜 License

MIT License
