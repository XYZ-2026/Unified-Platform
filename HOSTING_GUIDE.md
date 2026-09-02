# 🚀 Hostinger VPS Hosting Guide — Abroad Simplified Admin Panel
### Multi-Project VPS Deployment & Configuration

> **Target Domain:** `admit.abroadsimplified.com`  
> **Stack:** Next.js 16 (Frontend) + FastAPI (Backend) + Nginx + SSL  
> **Environment Note:** This guide is optimized for a VPS that **already hosts 3 existing active projects**.

---

## 📌 Multi-Project VPS Architecture Overview

When hosting multiple applications on a single VPS, the host operating system manages the entry point (ports `80` and `443`) and routes incoming traffic to the appropriate application based on the requested domain name (`server_name`).

```
                    Internet (HTTP/HTTPS)
                             │
                             ▼
     ┌──────────────────────────────────────────────────┐
     │         VPS Host Nginx (Ports 80 & 443)          │
     │      SSL Managed via Host Let's Encrypt          │
     └──────┬───────────────┬──────────────┬────────────┘
            │               │              │
    site1.com       site2.com      site3.com   admit.abroadsimplified.com
            │               │              │            │
      [Project 1]     [Project 2]    [Project 3]        ▼
                                               ┌────────────────────────┐
                                               │ Abroad Simplified      │
                                               │ Docker Services        │
                                               ├────────────────────────┤
                                               │ • Next.js  → :3004     │
                                               │ • FastAPI  → :8004     │
                                               └────────────────────────┘
```

---

## Table of Contents

1. [Prerequisites & Multi-App Checklist](#1-prerequisites--multi-app-checklist)
2. [Port Allocation & Avoiding Conflicts](#2-port-allocation--avoiding-conflicts)
3. [VPS Swap Memory Setup (Prevent OOM Crashes)](#3-vps-swap-memory-setup-prevent-oom-crashes)
4. [DNS Configuration](#4-dns-configuration)
5. [Deploying Abroad Simplified](#5-deploying-abroad-simplified)
6. [Host Nginx Reverse Proxy Setup](#6-host-nginx-reverse-proxy-setup)
7. [SSL Certificate Configuration (Host Certbot)](#7-ssl-certificate-configuration-host-certbot)
8. [Automated Deployment with `deploy.sh`](#8-automated-deployment-with-deploysh)
9. [Safe Multi-App VPS Maintenance](#9-safe-multi-app-vps-maintenance)
10. [Troubleshooting & Health Checks](#10-troubleshooting--health-checks)

---

## 1. Prerequisites & Multi-App Checklist

Before deploying, ensure you have:
- Access to your VPS via SSH (`ssh deploy@YOUR_VPS_IP` or `ssh root@YOUR_VPS_IP`).
- DNS A-record for `admit.abroadsimplified.com` pointing to the VPS IP.
- The `.env.production` file ready with all your production API keys.
- Docker and Docker Compose installed on the VPS.
- **Host Nginx** installed on the VPS managing the existing 3 projects.

---

## 2. Port Allocation & Avoiding Conflicts

Because 3 other projects are already running on this server, standard ports like `3000` or `8000` might already be taken by those projects.

### 2.1 Check Currently Used Ports

Run this command on your VPS to see which ports are currently occupied:

```bash
sudo ss -tulpn | grep LISTEN
```
*(Or use `sudo lsof -i -P -n | grep LISTEN`)*

### 2.2 Recommended Port Mapping

For Abroad Simplified, assign dedicated host ports (example below uses `3004` and `8004`):

| Service | Internal Container Port | Host Port (Recommended) | Config Location |
| :--- | :--- | :--- | :--- |
| **Next.js Frontend** | `3000` | `3004` | `FRONTEND_PORT=3004` in `.env.production` |
| **FastAPI Backend** | `8000` | `8004` | `BACKEND_PORT=8004` in `.env.production` |

> 💡 *If ports 3004 or 8004 are already in use, pick any available port (e.g., 3010 / 8010) and update `.env.production` accordingly.*

---

## 3. VPS Swap Memory Setup (Prevent OOM Crashes)

Running 4 full applications on a single VPS can cause memory spikes during Next.js builds or heavy traffic. To ensure your other 3 projects **never crash due to Out-Of-Memory (OOM)**, verify that your server has swap space configured:

```bash
# Check existing swap
free -h
swapon --show
```

If swap is 0 or less than 2 GB, create a **4 GB swap file**:

```bash
# Create a 4GB swap file
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Optimize swap aggressiveness for web servers
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

---

## 4. DNS Configuration

Add an **A Record** in your DNS provider (Hostinger DNS, Cloudflare, GoDaddy, etc.):

| Type | Host / Name | Points to (Value) | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `admit` | `YOUR_VPS_IP` | `3600` (or Auto) |

> Check DNS propagation with: `dig admit.abroadsimplified.com +short` or at [whatsmydns.net](https://www.whatsmydns.net/).

---

## 5. Deploying Abroad Simplified

### 5.1 Clone Repository in an Isolated Folder

Keep each of your 4 projects in their own isolated directory under `/home/deploy/apps/` or `/var/www/`:

```bash
# Navigate to apps directory
mkdir -p ~/apps
cd ~/apps

# Clone repository
git clone https://github.com/YOUR_USERNAME/abroad-simplified-landing.git
cd abroad-simplified-landing
```

### 5.2 Configure `.env.production`

Copy the template and fill in your secrets along with the port mappings:

```bash
cp .env.production.example .env.production
nano .env.production
```

Add your production keys and port configurations:

```env
# ─── Firebase Client SDK ───
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=csaryan-78422.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=csaryan-78422
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=csaryan-78422.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=730264196656
NEXT_PUBLIC_FIREBASE_APP_ID=1:730264196656:web:...

# ─── Firebase Admin SDK ───
FIREBASE_ADMIN_PROJECT_ID=csaryan-78422
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@csaryan-78422.iam.gserviceaccount.com

# ─── Wix CMS API ───
WIX_API_KEY=IST.eyJ...
WIX_SITE_ID=be07e82f-...
WIX_ACCOUNT_ID=6519cf35-...
WIX_MEMBER_ID=f39444b1-...

# ─── AI Provider Keys ───
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AQ.Ab8R...
OPENROUTER_API_KEY=sk-or-v1-...

# ─── Port Allocation for Multi-Project VPS ───
FRONTEND_PORT=3004
BACKEND_PORT=8004
```

Save and exit (`Ctrl + O`, `Enter`, `Ctrl + X`).

### 5.3 Start the Application Containers

Start the containers using Docker Compose:

```bash
docker compose up -d --build frontend backend
```

Verify that the containers are running and bound to the right ports:

```bash
docker compose ps
```

You should see:
- `abroad-frontend` listening on `0.0.0.0:3004->3000/tcp`
- `abroad-backend` listening on `0.0.0.0:8004->8000/tcp`

Test local container responses:
```bash
curl -I http://127.0.0.1:3004
curl -I http://127.0.0.1:8004/docs
```

---

## 6. Host Nginx Reverse Proxy Setup

Since the VPS already has Host Nginx running for the other 3 websites, we will add an isolated server block for `admit.abroadsimplified.com`. This will **not** interfere with existing site configs.

### 6.1 Create Nginx Site Configuration

Create `/etc/nginx/sites-available/admit.abroadsimplified.com`:

```bash
sudo nano /etc/nginx/sites-available/admit.abroadsimplified.com
```

Paste the following configuration (adjust ports `3004` and `8004` if you customized them):

```nginx
# Rate limiting zone for Abroad Simplified API
limit_req_zone $binary_remote_addr zone=abroad_api:10m rate=10r/s;

server {
    listen 80;
    server_name admit.abroadsimplified.com;

    client_max_body_size 50M;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

    # ─── Backend API Routes (/api/backend/*) ───
    location /api/backend/ {
        limit_req zone=abroad_api burst=20 nodelay;

        # Strip /api/backend prefix and forward to FastAPI
        rewrite ^/api/backend/(.*)$ /$1 break;
        proxy_pass http://127.0.0.1:8004;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }

    # ─── Next.js Frontend (All other routes) ───
    location / {
        proxy_pass http://127.0.0.1:3004;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # ─── Next.js Static Cache Optimization ───
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3004;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6.2 Enable the Site & Test Nginx

Enable the site symlink and test Nginx configuration before reloading:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/admit.abroadsimplified.com /etc/nginx/sites-enabled/

# Test configuration (Crucial so you don't break existing sites!)
sudo nginx -t

# If syntax is OK, reload Nginx
sudo systemctl reload nginx
```

---

## 7. SSL Certificate Configuration (Host Certbot)

Use Host Certbot to issue an SSL certificate for `admit.abroadsimplified.com`. This operates independently and will **not touch certificates of the other 3 websites**:

```bash
sudo certbot --nginx -d admit.abroadsimplified.com
```

- When prompted, select **Redirect HTTP to HTTPS** (Option 2).
- Certbot will automatically configure the SSL cert paths and HTTPS renewal inside `/etc/nginx/sites-available/admit.abroadsimplified.com`.

### 7.1 Verify SSL Auto-Renewal

```bash
sudo certbot renew --dry-run
```

---

## 8. Automated Deployment with `deploy.sh`

A zero-downtime, safe deployment script `deploy.sh` is provided in the repository root. It safely pulls the latest code, rebuilds Docker containers for this project, and cleans dangling build cache without affecting the other 3 projects.

### 8.1 Make the Script Executable

```bash
cd ~/apps/abroad-simplified-landing
chmod +x deploy.sh
```

### 8.2 Run the Deployment

```bash
./deploy.sh
```

### What `deploy.sh` Does:
1. Validates prerequisites (`git`, `docker`, `docker compose`, `.env.production`).
2. Stashes any local edits to prevent git pull conflicts.
3. Pulls the latest commits from the current active git branch.
4. Builds and restarts `frontend` and `backend` containers in the background.
5. Runs **safe image pruning** (`docker image prune -f`) to reclaim disk space without touching other projects' Docker images or volumes.
6. Prints a status health check of running services.

---

## 9. Safe Multi-App VPS Maintenance

> ⚠️ **CRITICAL WARNING FOR MULTI-TENANT VPS:**  
> **NEVER run `docker system prune -a` or `docker volume prune` on this server!**  
> Doing so would permanently delete the containers, images, and database volumes of the other 3 hosted projects.

### 9.1 Viewing Logs (Project-Specific)

Always specify container names so you only see Abroad Simplified logs:

```bash
# Next.js Frontend logs
docker compose logs -f frontend

# FastAPI Backend logs
docker compose logs -f backend

# Nginx host logs for this domain
sudo tail -f /var/log/nginx/error.log
```

### 9.2 Restarting Only Abroad Simplified

```bash
# Restart both frontend & backend
docker compose restart

# Restart only frontend
docker compose restart frontend

# Restart only backend
docker compose restart backend
```

### 9.3 Database Backup (Isolated)

```bash
mkdir -p ~/backups/abroad-simplified
docker cp abroad-backend:/app/data ~/backups/abroad-simplified/backup-$(date +%F)
```

Add an isolated cron job for automatic daily backups:
```bash
crontab -e
# Add this line (runs daily at 3:00 AM):
0 3 * * * docker cp abroad-backend:/app/data /home/deploy/backups/abroad-simplified/backup-$(date +\%F)
```

---

## 10. Troubleshooting & Health Checks

| Problem | Cause | Solution |
| :--- | :--- | :--- |
| **Port Conflict Error on `docker compose up`** | Another project uses the configured port | Check ports with `sudo ss -tulpn`. Change `FRONTEND_PORT` or `BACKEND_PORT` in `.env.production` and run `./deploy.sh`. |
| **502 Bad Gateway on `admit.abroadsimplified.com`** | Frontend/Backend containers are stopped or port mismatch | Run `docker compose ps` to see if `abroad-frontend` is Up. Check that the port in `/etc/nginx/sites-available/admit.abroadsimplified.com` matches `FRONTEND_PORT`. |
| **Nginx reload fails** | Syntax error in Nginx config | Run `sudo nginx -t` to locate the exact error line. |
| **Server Slow / High Memory Usage** | 4 applications competing for RAM | Check memory with `htop` or `free -h`. Ensure the 4GB Swap file is active ([Section 3](#3-vps-swap-memory-setup-prevent-oom-crashes)). |
| **SSL handshake error** | DNS hasn't propagated or Certbot failed | Verify DNS with `dig admit.abroadsimplified.com +short` and run `sudo certbot --nginx -d admit.abroadsimplified.com`. |

### Summary of Daily Useful Commands

```bash
# Deploy latest changes
cd ~/apps/abroad-simplified-landing && ./deploy.sh

# Check status of this app
docker compose ps

# Check host memory and CPU
htop
```
