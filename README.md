# 🚀 RockyTodo Setup Guide

**Supported Platforms**:  
- **Ubuntu 24.04** (Full Support) ✅  
- **Windows 10 & 11** (Partial Support) ⚠️  
    _Note: Currently, only the Ubuntu installation is 100% supported. Windows users may encounter additional setup steps._

---

## 🖥️ **Supported Installation Window**

| Platform       | Support Level  | Status   |
| -------------- | -------------- | -------- |
| **Ubuntu 24.04** | Full Support   | ✅ Fully working, not production ready |
| **Debian 12** | Full Support   | ⚠️ Wasnt fully tested, not production ready, should work jsut fine |
| **Cent os** | Partial support   | ⚠️ Wasnt tested, not production ready, should work jsut fine |
| **Windows 10/11** | Partial Support | ⚠️ Installation working but may require additional configuration |

> **Note**: The Ubuntu installation process is fully supported and tested. If you're running **Windows 10** or **11**, you might need to make additional adjustments to get everything running smoothly. The Ubuntu setup is recommended for ease of use and stability. Windows can run all files but there is not official guide to install it on windows

---

## **1. Prerequisites**

Make sure you have the following installed on your system:

- **Ubuntu** 24.04 LTS (for full support)
- **Node.js 20.x** (for backend services)
- **Redis** (for in-memory data storage)
- **Nginx** (for reverse proxy and serving static files)
- **Open port** (You need to have open port 6583 for backend to work)

If you're running **Windows 10 or 11**, you can follow the steps, but be aware that additional configuration may be required.

To access forgot password you need to go to route /forgot-password but there is know bug that prevents the email template to send the correct reset link.

---

## **2. Install Dependencies**

### **Step 1: Update System Packages**
```bash
sudo apt update
sudo apt upgrade -y
```

### **Step 2: Install dependencies**
```bash
sudo apt install redis-server
sudo apt install nginx
sudo apt install tar

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### **Step 3: Creating app directory**
```bash
mkdir -p /var/www/rockytodo
cd /var/www/rockytodo
```
### **Step 5: Clonning the repository**
```bash
curl -L -o RockyTodoR-0.0.1.tar.gz https://github.com/TechnicolorDev/RockyTodoR/releases/tag/RockyTodo-Alpha-0.0.1
tar -xzvf RockyTodoR-0.0.1.tar.gz
chmod -R 755 storage/* bootstrap/cache/
```

### **Step 6: Setting up enviroment (for queue worker use default port and localhost with no password if you dont have external host)**
```bash
yarn env:setup
```

### **Step 7: Generating APP key**
```bash
yarn env:key:generate
```

### **Step 8: Setting up SMTP (Can be skipped**
```bash
yarn env:smtp:setup
```

### **Step 9: Setting up redis**
```bash
sudo systemctl start redis
sudo systemctl status redis
sudo systemctl enable redis
```

### **Step 10: Setting up queue worker Part 1.**
```bash
sudo nano /etc/systemd/system/rockytodo.service
```

### **Step 11: Setting up queue worker Part 2.**
```bash
[Unit]
Description=Bull Queue Worker for RockyTodo
After=redis-server.service

[Service]
User=www-data
Group=www-data
Restart=always
RestartSec=5s
ExecStart=/usr/bin/node /var/www/rockytodo/server/queue/exports/queue.js

EnvironmentFile=/var/www/rockytodo/.env
StartLimitInterval=180
StartLimitBurst=30

[Install]
WantedBy=multi-user.target
```
### **Step 12: Starting queue worker**
```bash
sudo systemctl enable rockytodo.service
```

### **Step 13: Giving the directory correct permissions**
```bash
chown -R www-data:www-data /var/www/rockytodo/*
```

### **Step 14: Setup admin account**

Create it by going on https://domain.com/install

## **IMPORTANT**
Next update will add more things to install route like not requiring yarn env:setup or other things also so once first admin was created then /install will be disabled. Also i will add subuser creation.

## **3. Setting up web server**

### **Step 1: Setting up nginx (Creating conf file)**
```bash
sudo nano /etc/nginx/sites-available/rocky.conf
```

### **Step 2: Setting up nginx (Content of conf file)**
```bash
server {
    listen 80;
    server_name serve.hrajme.fun;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name serve.hrajme.fun;

    # SSL Configuration (use your actual SSL cert files)
    ssl_certificate /etc/letsencrypt/live/serve.hrajme.fun-0001/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/serve.hrajme.fun-0001/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/serve.hrajme.fun-0001/chain.pem;

    # SSL settings for stronger encryption and security
    ssl_protocols TLSv1.2 TLSv1.3;  # Disable SSL and older versions
    ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;  # Use the server's preferred ciphers
    ssl_dhparam /etc/ssl/certs/dhparam.pem;  # Strong Diffie-Hellman group (generate using `openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048`)

    # Add security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;  # Force HTTPS
    add_header X-Content-Type-Options nosniff always;  # Prevent MIME sniffing
    add_header X-Frame-Options "DENY" always;  # Prevent clickjacking
    add_header X-XSS-Protection "1; mode=block" always;  # Enable XSS protection
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;  # Control referrer information
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none';" always;  # Strong CSP to mitigate XSS attacks

    # Serve static files for the React app
    root /var/www/dev/public/assets;
    index index.html index.htm;

    # SPA Routing (Fallback for client-side routing)
    location / {
        try_files $uri /index.html;  # For single-page apps, fallback to index.html
    }

    # API routes: Handle POST requests for /emails/forgot-password
    location /emails/forgot-password {
        # Allowing HTTP Methods
        limit_except GET POST PUT DELETE PATCH {
            deny all;
        }

        # If you're using reverse proxy to Express, add this block
        proxy_pass http://localhost:6583;  # Assuming Express app is running on port 3000
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Handle CORS headers if necessary
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, PATCH';
        add_header Access-Control-Allow-Headers 'Content-Type, X-Requested-With';

        # Handle OPTIONS preflight requests (CORS)
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, PATCH';
            add_header Access-Control-Allow-Headers 'Content-Type, X-Requested-With';
            return 204;
        }
    }

    # Default API location for all other API routes
    location /api/ {
        # Allowing HTTP Methods
        limit_except GET POST PUT DELETE PATCH {
            deny all;
        }

        # If you're using reverse proxy to Express, add this block
        proxy_pass http://localhost:3000;  # Assuming Express app is running on port 3000
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Handle CORS headers if necessary
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, PATCH';
        add_header Access-Control-Allow-Headers 'Content-Type, X-Requested-With';

        # Handle OPTIONS preflight requests (CORS)
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, PATCH';
            add_header Access-Control-Allow-Headers 'Content-Type, X-Requested-With';
            return 204;
        }
    }
}

```

### **Step 3: Setting up nginx (Linking files)**
```bash
sudo ln -s /etc/nginx/sites-available/rocky.conf /etc/nginx/sites-enabled/rocky.conf
```

### **Step 4: Setting up nginx (Restarting nginx)**
```bash
sudo service nginx restart
```


## **4. Setting up backend (Rocky Daemon)**

### **Step 1: Installing pm2**
```bash
yarn add pm2
```

### **Step 2: Starting the daemon**
```bash
yarn pm2 start server/server.js --name Rocky-Daemon
```

### **Step 3: Making it autmatically start on boot**
```bash
yarn pm2 save && yarn pm2 startup
```

### **Additional commands**
```bash
yarn pm2 stop server/server.js

yarn pm2 restart server/server.js
```


## ** Information **

This app is fun project to represent at school i published to help people with learning ReactTS Scss and NodeJS, i plane to updating the project, i plan to add more security to this poject, i want to add new design and new functions new possible way to customize the todos. Next release will be major fronend remake. I will also add support for postgres and mysql alongside to current sqlite, also i will make the install route much better and much more customizable and add admin page for more advanced things like api creation and etc. Thanks anyone for support. 