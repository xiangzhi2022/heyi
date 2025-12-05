# 🚀 H1R Hub - 快速部署指南

## 📦 已准备的部署文件

✅ **构建产物**: `heyi-dist.zip` (已打包)
✅ **部署文档**: `DEPLOYMENT_GUIDE.md` (详细步骤)
✅ **一键部署脚本**: `deploy.sh` (Linux 自动化)
✅ **更新脚本**: `update.sh` (快速更新)
✅ **Docker 支持**: `Dockerfile` + `docker-compose.yml`

---

## ⚡ 三种部署方式

### 方式 1: 一键脚本部署（最快）

```bash
# 在你的 Linux 服务器上运行
wget https://raw.githubusercontent.com/xiangzhi2022/heyi/main/deploy.sh
chmod +x deploy.sh
sudo ./deploy.sh
```

**注意**: 运行前请编辑 `deploy.sh`，将 `DOMAIN="your_domain.com"` 改为你的实际域名或 IP。

---

### 方式 2: 手动上传 dist 压缩包

#### 步骤 1: 上传文件到服务器

在本地 Windows 电脑上：
```powershell
# heyi-dist.zip 已在项目根目录
# 使用 WinSCP、FileZilla 或 SCP 上传到服务器
scp heyi-dist.zip your_user@your_server:/tmp/
```

#### 步骤 2: 在服务器上部署

```bash
# SSH 连接到服务器
ssh your_user@your_server

# 安装 Nginx
sudo apt update
sudo apt install nginx -y

# 创建网站目录
sudo mkdir -p /var/www/heyi

# 解压文件
sudo apt install unzip -y
sudo unzip /tmp/heyi-dist.zip -d /var/www/heyi

# 配置 Nginx
sudo nano /etc/nginx/sites-available/heyi
```

粘贴以下配置（将 `your_domain.com` 替换为你的域名）：

```nginx
server {
    listen 80;
    server_name your_domain.com;
    
    root /var/www/heyi;
    index index.html;
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

继续配置：

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/heyi /etc/nginx/sites-enabled/

# 设置权限
sudo chown -R www-data:www-data /var/www/heyi

# 测试并重启 Nginx
sudo nginx -t
sudo systemctl restart nginx

# 开放防火墙端口
sudo ufw allow 'Nginx Full'
```

✅ 完成！访问 `http://your_domain.com`

---

### 方式 3: Docker 部署

```bash
# 克隆项目
git clone https://github.com/xiangzhi2022/heyi.git
cd heyi

# 构建镜像
docker build -t heyi-app .

# 运行容器
docker run -d -p 80:80 --name heyi heyi-app

# 或使用 docker-compose
docker-compose up -d
```

---

## 🔄 更新已部署的项目

### 使用 Git（推荐）

```bash
# 在服务器上运行
cd /var/www/heyi
sudo git pull
sudo npm install
sudo npm run build
sudo systemctl reload nginx
```

或使用更新脚本：

```bash
sudo ./update.sh
```

### 手动上传新版本

1. 在本地重新构建：`npm run build`
2. 重新打包：`Compress-Archive -Path dist\* -DestinationPath heyi-dist.zip -Force`
3. 上传并替换服务器上的文件

---

## 📊 部署后检查

```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 查看访问日志
sudo tail -f /var/log/nginx/access.log
```

---

## 🔧 常见问题

### 1. 刷新页面出现 404

确保 Nginx 配置包含：
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 2. 权限错误

```bash
sudo chown -R www-data:www-data /var/www/heyi
sudo chmod -R 755 /var/www/heyi
```

### 3. 端口被占用

检查 80 端口是否被占用：
```bash
sudo lsof -i :80
sudo netstat -tulpn | grep :80
```

---

## 🌟 性能优化建议

1. ✅ **启用 HTTPS**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your_domain.com
   ```

2. ✅ **配置 CDN**（如 Cloudflare）

3. ✅ **启用 HTTP/2**（配置 SSL 后自动启用）

4. ✅ **配置缓存**（已在 Nginx 配置中包含）

---

## 📂 文件说明

| 文件 | 说明 |
|------|------|
| `heyi-dist.zip` | 构建后的静态文件压缩包 |
| `DEPLOYMENT_GUIDE.md` | 详细部署文档 |
| `deploy.sh` | Linux 一键部署脚本 |
| `update.sh` | 快速更新脚本 |
| `Dockerfile` | Docker 镜像构建文件 |
| `docker-compose.yml` | Docker Compose 配置 |
| `nginx.docker.conf` | Docker 使用的 Nginx 配置 |

---

## 📞 需要帮助？

- 查看详细文档：`DEPLOYMENT_GUIDE.md`
- 检查 Nginx 日志：`/var/log/nginx/error.log`
- GitHub 项目：https://github.com/xiangzhi2022/heyi

---

## ✅ 部署清单

- [ ] 服务器已安装 Nginx
- [ ] 已上传项目文件
- [ ] Nginx 配置已完成
- [ ] 防火墙端口已开放
- [ ] 可以通过域名/IP 访问
- [ ] （可选）已配置 SSL/HTTPS
- [ ] （可选）已配置 CDN

---

**祝部署顺利！🎉**
