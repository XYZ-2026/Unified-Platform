# 🚀 Hostinger VPS Hosting Guide — Abroad Simplified Admin Panel
### Multi-Project VPS Deployment & Configuration

> **Target Domain:** `admit.abroadsimplified.com`  
> **Stack:** Next.js 16 (Frontend) + FastAPI (Backend) + Nginx + SSL  
> **Environment Note:** This guide is custom-configured for your VPS with the exact active port mappings below.

---

## 📌 Multi-Project VPS Architecture Overview

Your VPS currently hosts 3 existing applications. All projects are reverse-proxied by **Host Nginx** (listening on ports `80` and `443`), which routes incoming requests to the appropriate container based on the domain name (`server_name`).

```
                              Internet (HTTP/HTTPS)
                                        │
                                        ▼
      ┌──────────────────────────────────────────────────────────────────┐
      │                  VPS Host Nginx (Ports 80 & 443)                 │
      │                SSL Managed via Host Let's Encrypt                │
      └───────┬─────────────────┬────────────────┬───────────────────────┘
              │                 │                │                       │
      prep.abroadsimplified   research.abroad    hr.abroad     admit.abroadsimplified.com
              │                 │                │                       │
              ▼                 ▼                ▼                       ▼
      [Prep Abroad App]  [Research Tool]    [HR Portal]    ┌───────────────────────────┐
       • Next.js :4000    • Frontend :3000   • Front :3001 │ Abroad Simplified Admin   │
                          • Backend  :8000   • Back  :8001 ├───────────────────────────┤
                          • Postgres :5432                 │ • Next.js Frontend → :3002│
                                                           │ • FastAPI Backend  → :8002│
                                                           └───────────────────────────┘
```

---

## Table of Contents

1. [Prerequisites & Multi-App Checklist](#1-prerequisites--multi-app-checklist)
2. [Existing VPS Port Map & New Port Allocation](#2-existing-vps-port-map--new-port-allocation)
3. [VPS Swap Memory Setup (Prevent OOM Crashes)](#3-vps-swap-memory-setup-prevent-oom-crashes)
4. [DNS Configuration](#4-dns-configuration)
5. [Deploying Abroad Simplified Admin](#5-deploying-abroad-simplified-admin)
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
- The `.env` file ready with all your production API keys.
- Docker and Docker Compose installed on the VPS.
- **Host Nginx** installed on the VPS managing the existing 3 projects.

---

## 2. Existing VPS Port Map & New Port Allocation

### 2.1 Currently Running Projects on VPS

| Project / Container Name | Image / Role | Host Port Occupied |
| :--- | :--- | :--- |
| `abroad-simplified` | `prepabroadsimplified-abroad-simplified-app` | `4000` |
| `abroad_frontend` | `research-tool-as-frontend` | `3000` |
| `abroad_backend` | `research-tool-as-backend` | `8000` |
| `abroad_db` | `postgres:15-alpine` | `5432` |
| `hr_frontend` | `hr-portal-frontend` | `3001` |
| `hr_backend` | `hr-portal-backend` | `8001` |

---

### 2.2 Dedicated Port Allocation for Abroad Simplified Admin

To completely avoid collision with any existing containers, Abroad Simplified Admin uses **Port `3002`** and **Port `8002`**:

| Service | Container Name | Host Port | Internal Container Port |
| :--- | :--- | :--- | :--- |
| **Next.js Frontend** | `abroad-admin-frontend` | **`3002`** | `3000` |
| **FastAPI Backend** | `abroad-admin-backend` | **`8002`** | `8000` |

*Note: Container names are explicitly prefixed with `abroad-admin-` to eliminate any confusion with the research tool's `abroad_frontend`/`abroad_backend` or prep's `abroad-simplified`.*

---

## 3. VPS Swap Memory Setup (Prevent OOM Crashes)

Running 4 full-stack applications simultaneously can cause memory spikes during Next.js builds or high traffic. To protect existing projects from being killed by the Linux Out-Of-Memory (OOM) killer, ensure a **4 GB Swap File** is active:

```bash
# Check current swap status
free -h
swapon --show
```

If swap is 0 or under 2 GB, set up a 4 GB swap file:

```bash
# Create a 4GB swap file
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap persistent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Optimize swappiness for production web servers
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

---

## 4. DNS Configuration

In your DNS dashboard (Hostinger DNS, Cloudflare, GoDaddy, etc.), create an **A Record** pointing `admit.abroadsimplified.com` to your VPS IP:

| Type | Host / Name | Value (Points To) | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `admit` | `YOUR_VPS_IP` | `3600` (or Auto) |

Verify resolution with:
```bash
dig admit.abroadsimplified.com +short
```

---

## 5. Deploying Abroad Simplified Admin

### 5.1 Clone Repository in Isolated Directory

```bash
mkdir -p ~/apps
cd ~/apps

# Clone repository
git clone https://github.com/YOUR_USERNAME/abroad-simplified-landing.git
cd abroad-simplified-landing
```

### 5.2 Create `.env`

```bash
cp .env.example .env
nano .env
```

Fill in your actual production credentials:

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

# ─── Multi-Project VPS Port Allocation ───
FRONTEND_PORT=3002
BACKEND_PORT=8002
```

Save and exit (`Ctrl + O`, `Enter`, `Ctrl + X`).

### 5.3 Build and Start Containers

```bash
docker compose up -d --build frontend backend
```

Check container status:
```bash
docker compose ps
```

You will see:
- `abroad-admin-frontend` on `0.0.0.0:3002->3000/tcp`
- `abroad-admin-backend` on `0.0.0.0:8002->8000/tcp`

Test local container responses:
```bash
curl -I http://127.0.0.1:3002
curl -I http://127.0.0.1:8002/docs
```

---

## 6. Host Nginx Reverse Proxy Setup

We will configure Host Nginx to route requests for `admit.abroadsimplified.com` to ports `3002` (Frontend) and `8002` (FastAPI backend).

### 6.1 Create Nginx Site Configuration

```bash
sudo nano /etc/nginx/sites-available/admit.abroadsimplified.com
```

Paste the following configuration:

```nginx
# Rate limiting zone for Abroad Simplified Admin API
limit_req_zone $binary_remote_addr zone=abroad_admin_api:10m rate=10r/s;

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
        limit_req zone=abroad_admin_api burst=20 nodelay;

        # Strip /api/backend prefix and forward to FastAPI
        rewrite ^/api/backend/(.*)$ /$1 break;
        proxy_pass http://127.0.0.1:8002;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }

    # ─── Next.js Frontend (All other routes) ───
    location / {
        proxy_pass http://127.0.0.1:3002;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # ─── Next.js Static Assets Optimization ───
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3002;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6.2 Enable Site and Reload Nginx

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/admit.abroadsimplified.com /etc/nginx/sites-enabled/

# Test Nginx configuration (Crucial to protect existing sites!)
sudo nginx -t

# If syntax is OK, reload Nginx
sudo systemctl reload nginx
```

---

## 7. SSL Certificate Configuration (Host Certbot)

Issue an SSL certificate for `admit.abroadsimplified.com`. This runs independently and **does not modify or disrupt certificates of your other 3 sites**:

```bash
sudo certbot --nginx -d admit.abroadsimplified.com
```

- Choose **Redirect HTTP to HTTPS** (Option 2).
- Certbot will update the Nginx configuration automatically.

Test certificate renewal:
```bash
sudo certbot renew --dry-run
```

---

## 8. Automated Deployment with `deploy.sh`

A dedicated script `deploy.sh` is provided in the repository root for safe updates.

### 8.1 Make Script Executable & Run

```bash
cd ~/apps/abroad-simplified-landing
chmod +x deploy.sh
./deploy.sh
```

### What `deploy.sh` Does:
1. Validates `.env` and system dependencies.
2. Pulls the latest commits from your active Git branch.
3. Rebuilds and restarts `abroad-admin-frontend` and `abroad-admin-backend`.
4. Runs safe dangling image cleanup (`docker image prune -f`) without touching images or volumes from the other 3 projects.
5. Prints the health status of active containers.

---

## 9. Safe Multi-App VPS Maintenance

> ⚠️ **CRITICAL RULES FOR MULTI-APP VPS:**  
> 1. **NEVER run `docker system prune -a` or `docker volume prune`!**  
>    It will wipe container images and persistent database volumes (`abroad_db`, etc.) belonging to the other 3 projects.  
> 2. Always use `docker compose logs` inside the project folder so logs don't mix.

### 9.1 View Logs for Abroad Simplified Admin

```bash
cd ~/apps/abroad-simplified-landing

# Frontend logs
docker compose logs -f frontend

# Backend logs
docker compose logs -f backend

# Host Nginx access/error logs
sudo tail -f /var/log/nginx/error.log
```

### 9.2 Restarting Services

```bash
cd ~/apps/abroad-simplified-landing

# Restart both frontend and backend
docker compose restart

# Restart only frontend
docker compose restart frontend
```

### 9.3 Isolated Database Backup

```bash
mkdir -p ~/backups/abroad-admin
docker cp abroad-admin-backend:/app/data ~/backups/abroad-admin/backup-$(date +%F)
```

Automatic daily backup in crontab (`crontab -e`):
```bash
0 3 * * * docker cp abroad-admin-backend:/app/data /home/deploy/backups/abroad-admin/backup-$(date +\%F)
```

---

## 10. Troubleshooting & Health Checks

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **Port Conflict on Deploy** | Port 3002 or 8002 is busy | Run `sudo ss -tulpn`. Adjust `FRONTEND_PORT` or `BACKEND_PORT` in `.env` and `/etc/nginx/sites-available/admit.abroadsimplified.com`. |
| **502 Bad Gateway** | Container is stopped or port mismatch in Nginx | Run `docker compose ps` to check if `abroad-admin-frontend` is Up. Ensure proxy port in Nginx matches `FRONTEND_PORT`. |
| **Nginx reload fails** | Syntax error in Nginx config | Run `sudo nginx -t` to find the exact line with the issue. |
| **Out of Memory Spikes** | All 4 apps consuming RAM | Check with `htop` or `free -h`. Ensure 4GB Swap is active ([Section 3](#3-vps-swap-memory-setup-prevent-oom-crashes)). |
| **SSL Handshake Error** | DNS not resolved | Check DNS with `dig admit.abroadsimplified.com +short` and reissue with `sudo certbot --nginx -d admit.abroadsimplified.com`. |

### Summary of Quick Commands

```bash
# Update and deploy
cd ~/apps/abroad-simplified-landing && ./deploy.sh

# Check active containers
docker ps

# Check VPS resource usage
htop
```
