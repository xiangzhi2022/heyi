#!/bin/bash

# H1R Hub 项目更新脚本
# 用于快速更新已部署的项目

set -e

echo "======================================"
echo "H1R Hub 项目更新脚本"
echo "======================================"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_DIR="/var/www/heyi"

# 检查项目目录是否存在
if [ ! -d "$PROJECT_DIR" ]; then
    echo "错误: 项目目录不存在！"
    echo "请先运行 deploy.sh 进行初始部署"
    exit 1
fi

cd $PROJECT_DIR

echo -e "${YELLOW}1/5: 拉取最新代码...${NC}"
git pull

echo -e "${YELLOW}2/5: 安装/更新依赖...${NC}"
npm install

echo -e "${YELLOW}3/5: 构建项目...${NC}"
npm run build

echo -e "${YELLOW}4/5: 设置权限...${NC}"
chown -R www-data:www-data $PROJECT_DIR

echo -e "${YELLOW}5/5: 重新加载 Nginx...${NC}"
systemctl reload nginx

echo ""
echo -e "${GREEN}======================================"
echo "✅ 更新完成！"
echo "=====================================${NC}"
echo ""
