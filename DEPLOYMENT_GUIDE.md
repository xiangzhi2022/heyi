# H1R Hub 项目部署指南

本指南将帮助你将 H1R Hub 项目部署到 Linux 服务器上。

## 📦 项目已构建完成

构建产物位于 `dist/` 目录中，包含所有优化后的静态文件。

---

## 🚀 部署方式选择

### 方式 1: 使用 Nginx（推荐）
适合生产环境，性能最佳。

### 方式 2: 使用 Node.js + serve
最简单，适合快速测试。

---

## 📋 方式 1: Nginx 部署（推荐）

### 步骤 1: 准备服务器环境

```bash
# 连接到你的 Linux 服务器
ssh your_user@your_server_ip

# 更新系统包
sudo apt update && sudo apt upgrade -y  # Ubuntu/Debian
# 或
sudo yum update -y  # CentOS/RHEL
```

### 步骤 2: 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查状态
sudo systemctl status nginx
```

### 步骤 3: 上传项目文件

**方法 A: 使用 Git（推荐）**

```bash
# 在服务器上安装 git
sudo apt install git -y  # Ubuntu/Debian
# 或
sudo yum install git -y  # CentOS/RHEL

# 克隆项目
cd /var/www
sudo git clone https://github.com/xiangzhi2022/heyi.git
cd heyi

# 安装 Node.js 和 npm（如果服务器上没有）
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 安装项目依赖并构建
npm install
npm run build

# 设置正确的权限
sudo chown -R www-data:www-data /var/www/heyi
```

**方法 B: 使用 SCP 上传 dist 目录**

在你的本地 Windows 电脑上运行（使用 PowerShell）：

```powershell
# 压缩 dist 目录
Compress-Archive -Path f:\project\heyi\dist\* -DestinationPath f:\project\heyi\heyi-dist.zip

# 使用 SCP 上传（需要安装 OpenSSH 客户端）
scp f:\project\heyi\heyi-dist.zip your_user@your_server_ip:/tmp/
```

在服务器上：

```bash
# 创建网站目录
sudo mkdir -p /var/www/heyi

# 解压文件
sudo apt install unzip -y  # 如果需要
sudo unzip /tmp/heyi-dist.zip -d /var/www/heyi

# 设置权限
sudo chown -R www-data:www-data /var/www/heyi
```

### 步骤 4: 配置 Nginx

```bash
# 创建 Nginx 配置文件
sudo nano /etc/nginx/sites-available/heyi
```

粘贴以下配置：

```nginx
server {
    listen 80;
    server_name your_domain.com;  # 替换为你的域名或服务器IP

    root /var/www/heyi/dist;  # 如果直接上传 dist，使用 /var/www/heyi
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

保存并退出（Ctrl+X, 然后 Y, 然后 Enter）

```bash
# 创建软链接启用站点
sudo ln -s /etc/nginx/sites-available/heyi /etc/nginx/sites-enabled/

# 测试 Nginx 配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx
```

### 步骤 5: 配置防火墙（如果启用了）

```bash
# Ubuntu (UFW)
sudo ufw allow 'Nginx Full'
sudo ufw enable

# CentOS (Firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 步骤 6: （可选）配置 SSL/HTTPS

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y  # Ubuntu/Debian

# 获取证书并自动配置 Nginx
sudo certbot --nginx -d your_domain.com

# 测试自动续期
sudo certbot renew --dry-run
```

---

## 📋 方式 2: Node.js + serve 部署（简单快速）

### 步骤 1: 上传并安装

```bash
# 连接到服务器
ssh your_user@your_server_ip

# 克隆项目
cd ~
git clone https://github.com/xiangzhi2022/heyi.git
cd heyi

# 安装 Node.js（如果没有）
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 安装依赖并构建
npm install
npm run build

# 安装 serve
npm install -g serve
```

### 步骤 2: 运行服务

```bash
# 运行在 3000 端口
serve -s dist -l 3000

# 或使用 PM2 保持运行（推荐）
npm install -g pm2
pm2 serve dist 3000 --name heyi --spa
pm2 save
pm2 startup
```

### 步骤 3: 开放端口

```bash
# Ubuntu (UFW)
sudo ufw allow 3000

# CentOS (Firewalld)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

现在可以通过 `http://your_server_ip:3000` 访问。

---

## 📋 方式 3: Docker 部署（适合容器化环境）

### 创建 Dockerfile

在项目根目录创建 `Dockerfile`：

```dockerfile
FROM nginx:alpine

# 复制构建产物到 nginx 目录
COPY dist /usr/share/nginx/html

# 复制 nginx 配置（可选）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 创建 nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

### 构建和运行

```bash
# 构建镜像
docker build -t heyi-app .

# 运行容器
docker run -d -p 80:80 --name heyi heyi-app

# 或使用 docker-compose
```

---

## 🔍 验证部署

访问你的服务器：
- **Nginx**: `http://your_domain.com` 或 `http://your_server_ip`
- **serve**: `http://your_server_ip:3000`

---

## 🛠️ 常见问题

### 1. 页面刷新后 404 错误
确保 Nginx 配置中包含 `try_files $uri $uri/ /index.html;`

### 2. 权限错误
```bash
sudo chown -R www-data:www-data /var/www/heyi
sudo chmod -R 755 /var/www/heyi
```

### 3. Nginx 无法启动
```bash
# 检查配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

### 4. 更新部署
```bash
# 方式 1: Git 更新
cd /var/www/heyi
sudo git pull
npm install
npm run build
sudo systemctl reload nginx

# 方式 2: 直接替换 dist
# 上传新的 dist.zip，然后：
sudo rm -rf /var/www/heyi/dist
sudo unzip /tmp/heyi-dist.zip -d /var/www/heyi
sudo chown -R www-data:www-data /var/www/heyi
sudo systemctl reload nginx
```

---

## 📊 性能优化建议

1. **启用 Gzip 压缩**（已在配置中包含）
2. **配置 CDN**（如 Cloudflare）
3. **使用 HTTP/2**（配置 SSL 后自动启用）
4. **设置适当的缓存策略**（已在配置中包含）

---

## 📝 快速命令参考

```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 重启 Nginx
sudo systemctl restart nginx

# 重新加载配置
sudo systemctl reload nginx

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 查看访问日志
sudo tail -f /var/log/nginx/access.log

# PM2 管理（如使用 serve）
pm2 status
pm2 restart heyi
pm2 logs heyi
```

---

## 🎉 完成！

你的 H1R Hub 项目现在应该已经成功部署在 Linux 服务器上了！

如有问题，请检查日志文件或参考上面的常见问题部分。
