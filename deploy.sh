#!/bin/bash

# H1R Hub 一键部署脚本 - Nginx 版本
# 适用于 Ubuntu/Debian 系统

set -e  # 遇到错误立即退出

echo "======================================"
echo "H1R Hub 项目一键部署脚本"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 配置变量
DOMAIN="your_domain.com"  # 修改为你的域名或服务器IP
PROJECT_DIR="/var/www/heyi"
NGINX_CONFIG="/etc/nginx/sites-available/heyi"

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}请使用 sudo 运行此脚本${NC}"
    exit 1
fi

echo -e "${YELLOW}步骤 1/7: 更新系统包...${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}步骤 2/7: 安装必要软件...${NC}"
apt install -y nginx git nodejs npm unzip curl

echo -e "${YELLOW}步骤 3/7: 克隆项目...${NC}"
if [ -d "$PROJECT_DIR" ]; then
    echo "项目目录已存在，拉取最新代码..."
    cd $PROJECT_DIR
    git pull
else
    mkdir -p /var/www
    cd /var/www
    git clone https://github.com/xiangzhi2022/heyi.git
    cd heyi
fi

echo -e "${YELLOW}步骤 4/7: 安装依赖并构建...${NC}"
npm install
npm run build

echo -e "${YELLOW}步骤 5/7: 设置权限...${NC}"
chown -R www-data:www-data $PROJECT_DIR

echo -e "${YELLOW}步骤 6/7: 配置 Nginx...${NC}"
cat > $NGINX_CONFIG << EOF
server {
    listen 80;
    server_name $DOMAIN;

    root $PROJECT_DIR/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    location / {
        try_files \$uri \$uri/ /index.html;
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
EOF

# 启用站点
ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/heyi

# 测试配置
nginx -t

echo -e "${YELLOW}步骤 7/7: 启动服务...${NC}"
systemctl enable nginx
systemctl restart nginx

# 配置防火墙
if command -v ufw &> /dev/null; then
    echo "配置防火墙..."
    ufw allow 'Nginx Full'
fi

echo ""
echo -e "${GREEN}======================================"
echo "✅ 部署完成！"
echo "======================================"
echo ""
echo "访问地址: http://$DOMAIN"
echo ""
echo "常用命令:"
echo "  查看状态: sudo systemctl status nginx"
echo "  重启服务: sudo systemctl restart nginx"
echo "  查看日志: sudo tail -f /var/log/nginx/error.log"
echo ""
echo "更新项目:"
echo "  cd $PROJECT_DIR"
echo "  sudo git pull"
echo "  sudo npm install"
echo "  sudo npm run build"
echo "  sudo systemctl reload nginx"
echo -e "${NC}"
