# 🚀 Hostinger VPS Hosting Guide — Abroad Simplified Admin Panel

> **Domain:** `admit.abroadsimplified.com`
> **Stack:** Next.js 16 (Frontend) + FastAPI (Backend) + Nginx + SSL

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Hostinger VPS Setup](#2-hostinger-vps-setup)
3. [DNS Configuration](#3-dns-configuration)
4. [Server Initial Setup](#4-server-initial-setup)
5. [Install Docker & Docker Compose](#5-install-docker--docker-compose)
6. [Deploy the Project](#6-deploy-the-project)
7. [SSL Certificate Setup](#7-ssl-certificate-setup)
8. [Start Production Services](#8-start-production-services)
9. [Maintenance & Updates](#9-maintenance--updates)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

- A **Hostinger VPS** plan (KVM 2 or higher recommended — at least 2 GB RAM)
- Domain `abroadsimplified.com` managed through Hostinger or any DNS provider
- SSH client (Terminal on Mac/Linux, or PuTTY / Windows Terminal on Windows)
- Your `.env.production` file with all API keys filled in

---

## 2. Hostinger VPS Setup

### 2.1 Purchase & Create VPS

1. Go to [Hostinger VPS Hosting](https://www.hostinger.com/vps-hosting)
2. Choose **KVM 2** plan or higher (2 GB RAM, 2 vCPU minimum)
3. During setup, select:
   - **OS:** Ubuntu 22.04 or 24.04 LTS
   - **Location:** Choose closest to your target audience (e.g., Mumbai for India)
   - **Set a strong root password** and save it securely

### 2.2 Access Your VPS

After setup, go to **hPanel → VPS → Manage** to find your server's IP address.

```bash
# Connect via SSH
ssh root@YOUR_VPS_IP
```

**Tip:** Set up SSH key authentication for passwordless login:
```bash
# On your local machine
ssh-keygen -t ed25519 -C "abroad-simplified-vps"
ssh-copy-id root@YOUR_VPS_IP
```

---

## 3. DNS Configuration

### 3.1 Point Domain to VPS

You need to create a DNS **A record** for `admit.abroadsimplified.com` pointing to your VPS IP.

#### If domain is on Hostinger:

1. Go to **hPanel → Domains → abroadsimplified.com → DNS / Nameservers**
2. Click **Manage DNS Records**
3. Add a new **A Record**:

| Type | Name    | Points to     | TTL  |
|------|---------|---------------|------|
| A    | admit   | YOUR_VPS_IP   | 3600 |

#### If domain is on another provider (e.g., GoDaddy, Cloudflare):

1. Go to your DNS management dashboard
2. Add an **A Record** with:
   - **Host/Name:** `admit`
   - **Value/Points to:** `YOUR_VPS_IP`
   - **TTL:** 3600 (or Auto)

> **IMPORTANT:** DNS propagation can take up to 24-48 hours, but usually completes within 5-30 minutes. Check at [whatsmydns.net](https://www.whatsmydns.net/).

---

## 4. Server Initial Setup

SSH into your VPS and run the following:

```bash
# Update system packages
apt update && apt upgrade -y

# Set timezone
timedatectl set-timezone Asia/Kolkata

# Install essential utilities
apt install -y curl git wget ufw htop nano

# Configure firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Verify firewall rules
ufw status
```

### 4.1 Create a Deploy User (Recommended)

```bash
# Create a non-root user for deployment
adduser deploy
usermod -aG sudo deploy

# Copy SSH keys to the new user
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy

# Switch to the deploy user
su - deploy
```

---

## 5. Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to the docker group
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
exit
ssh deploy@YOUR_VPS_IP

# Verify Docker installation
docker --version
docker compose version
```

---

## 6. Deploy the Project

### 6.1 Clone the Repository

```bash
# Create project directory
mkdir -p ~/apps
cd ~/apps

# Clone your repository
git clone https://github.com/YOUR_USERNAME/abroad-simplified-landing.git
cd abroad-simplified-landing
```

> If your repo is private, use a GitHub Personal Access Token:
> ```bash
> git clone https://YOUR_TOKEN@github.com/YOUR_USERNAME/abroad-simplified-landing.git
> ```

### 6.2 Create Production Environment File

```bash
# Copy the example env file
cp .env.production.example .env.production

# Edit with your real values
nano .env.production
```

Fill in all the values from your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=csaryan-78422.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=csaryan-78422
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=csaryan-78422.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=730264196656
NEXT_PUBLIC_FIREBASE_APP_ID=1:730264196656:web:...
FIREBASE_ADMIN_PROJECT_ID=csaryan-78422
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@csaryan-78422.iam.gserviceaccount.com
WIX_API_KEY=IST.eyJ...
WIX_SITE_ID=be07e82f-...
WIX_ACCOUNT_ID=6519cf35-...
WIX_MEMBER_ID=f39444b1-...
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AQ.Ab8R...
OPENROUTER_API_KEY=sk-or-v1-...
```

Save and exit (`Ctrl+X`, then `Y`, then `Enter`).

---

## 7. SSL Certificate Setup

### 7.1 Initial SSL Setup (First Time Only)

Before starting Nginx with SSL, you need to obtain certificates:

#### Step 1: Create a temporary HTTP-only Nginx config

```bash
mkdir -p nginx/ssl

cat > nginx/nginx-temp.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name admit.abroadsimplified.com;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 200 'Server is running. SSL setup in progress...';
            add_header Content-Type text/plain;
        }
    }
}
EOF
```

#### Step 2: Start temporary Nginx

```bash
docker run -d --name temp-nginx \
  -p 80:80 \
  -v $(pwd)/nginx/nginx-temp.conf:/etc/nginx/nginx.conf:ro \
  -v $(pwd)/certbot-webroot:/var/www/certbot \
  nginx:alpine
```

#### Step 3: Obtain SSL Certificate

```bash
mkdir -p certbot-webroot

docker run --rm \
  -v $(pwd)/nginx/ssl:/etc/letsencrypt \
  -v $(pwd)/certbot-webroot:/var/www/certbot \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d admit.abroadsimplified.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email
```

> **IMPORTANT:** Replace `your-email@example.com` with your actual email address.

#### Step 4: Stop temporary Nginx and clean up

```bash
docker stop temp-nginx
docker rm temp-nginx
rm nginx/nginx-temp.conf
```

---

## 8. Start Production Services

### 8.1 Build and Start Everything

```bash
cd ~/apps/abroad-simplified-landing

# Build and start all services
docker compose up -d --build
```

This will:
1. **Build** the Next.js frontend Docker image
2. **Build** the FastAPI backend Docker image
3. **Start** Nginx with SSL termination
4. **Start** Certbot for automatic SSL renewal

### 8.2 Verify Everything Is Running

```bash
# Check container status
docker compose ps

# Expected output:
# NAME              STATUS
# abroad-frontend   Up
# abroad-backend    Up
# abroad-nginx      Up
# abroad-certbot    Up
```

```bash
# Check logs for any errors
docker compose logs -f --tail=50
```

### 8.3 Test Your Site

1. Open `https://admit.abroadsimplified.com` in your browser
2. Verify SSL lock icon is showing (green padlock)
3. Test login and dashboard functionality
4. Test backend API: `https://admit.abroadsimplified.com/api/backend/docs`

---

## 9. Maintenance & Updates

### 9.1 Deploy Updates

```bash
cd ~/apps/abroad-simplified-landing

# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose up -d --build

# Clean up old images
docker image prune -f
```

### 9.2 Quick Deploy Script

Create a one-command deploy script:

```bash
cat > ~/deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Deploying Abroad Simplified..."
cd ~/apps/abroad-simplified-landing

echo "📥 Pulling latest code..."
git pull origin main

echo "🔨 Building and restarting services..."
docker compose up -d --build

echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete!"
echo ""
docker compose ps
EOF

chmod +x ~/deploy.sh
```

Now deploy with: `~/deploy.sh`

### 9.3 View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f nginx
```

### 9.4 Restart Services

```bash
# Restart everything
docker compose restart

# Restart specific service
docker compose restart frontend
docker compose restart backend
```

### 9.5 SSL Certificate Renewal

Certbot auto-renews. To manually renew:

```bash
docker compose run --rm certbot certbot renew
docker compose restart nginx
```

### 9.6 Backup Database

```bash
# One-time backup
mkdir -p ~/backups
docker cp abroad-backend:/app/database.db ~/backups/database-$(date +%F).db
```

Automated daily backup (add to crontab):

```bash
crontab -e
# Add this line:
0 2 * * * docker cp abroad-backend:/app/database.db /home/deploy/backups/database-$(date +\%F).db
```

---

## 10. Troubleshooting

| Issue | Solution |
|-------|----------|
| **502 Bad Gateway** | Check containers: `docker compose ps` |
| **SSL certificate error** | `docker compose run --rm certbot certbot renew --force-renewal` |
| **Site not loading** | Check DNS: `dig admit.abroadsimplified.com` |
| **Out of memory** | Check: `free -h` — upgrade VPS plan |
| **Container restarting** | Check logs: `docker compose logs frontend --tail=100` |
| **Build fails** | Ensure `.env.production` has all required variables |

### Useful Commands

```bash
# Check server resources
htop

# Check disk space
df -h

# Check Docker disk usage
docker system df

# Full Docker cleanup (careful!)
docker system prune -a

# Check which ports are in use
sudo ss -tlnp

# Test domain
curl -I https://admit.abroadsimplified.com
```

---

## Architecture Overview

```
Internet
    │
    ▼
┌─────────────────────────────────────────┐
│  Nginx (Port 80/443)                    │
│  ├─ SSL Termination (Let's Encrypt)     │
│  ├─ /api/backend/* → FastAPI :8000      │
│  └─ /* → Next.js :3000                  │
└─────────────────────────────────────────┘
    │                    │
    ▼                    ▼
┌──────────┐      ┌──────────────┐
│ Next.js  │      │   FastAPI    │
│ :3000    │      │   :8000      │
│ Frontend │      │   Backend    │
└──────────┘      └──────────────┘
```

---

## File Structure Reference

```
abroad-simplified-landing/
├── Dockerfile              ← Next.js frontend (multi-stage build)
├── docker-compose.yml      ← Orchestrates all services
├── .dockerignore           ← Excludes node_modules, .next, etc.
├── .env.production.example ← Template for production env vars
├── .env.production         ← Your actual production secrets (not in git)
├── nginx/
│   └── nginx.conf          ← Reverse proxy + SSL config
├── backend/
│   ├── Dockerfile          ← FastAPI backend
│   ├── main.py
│   └── requirements.txt
└── src/                    ← Next.js source code
```

---

**⚠️ Security Reminders:**
- Never commit `.env.production` to Git — it's already in `.gitignore`
- Regularly update your VPS: `sudo apt update && sudo apt upgrade -y`
- Monitor your server with `htop` and set up alerts in Hostinger hPanel
- Set up fail2ban for SSH brute-force protection:
  ```bash
  sudo apt install fail2ban -y
  sudo systemctl enable fail2ban
  ```
