#!/bin/bash

echo "🔐 设置 Cloudflare 环境变量"
echo "============================"

# 创建 .env 文件模板
cat > .env.template << 'EOF'
# Cloudflare Credentials
CLOUDFLARE_EMAIL=sj9292008133@gmail.com
CLOUDFLARE_API_KEY=41f85c6e0c35bf45087e855d051a8edb3a3ef
CLOUDFLARE_ACCOUNT_ID=e3c8c6f5f5f5f5f5f5f5f5f5f5f5f5f
CLOUDFLARE_ZONE_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Application Settings
APP_NAME="NYC Free Food Tracker"
APP_VERSION="1.0.0"
PORT=3000
NODE_ENV=production

# NYC Open Data API
NYC_API_BASE="https://data.cityofnewyork.us"
NYC_PANTRY_DATASET="s7vy-9q6d"
NYC_FRIDGE_DATASET="if26-z6xq"

# Feature Flags
ENABLE_CACHE=true
CACHE_DURATION=1800  # 30 minutes in seconds
ENABLE_LOGGING=true
EOF

echo "✅ 已创建 .env.template 文件"
echo ""
echo "📋 使用方法："
echo ""
echo "1. 复制模板文件："
echo "   cp .env.template .env"
echo ""
echo "2. 加载环境变量："
echo "   source .env"
echo ""
echo "3. 验证环境变量："
echo "   echo \$CLOUDFLARE_ACCOUNT_ID"
echo ""
echo "4. 使用环境变量部署："
echo "   CLOUDFLARE_ACCOUNT_ID=\$CLOUDFLARE_ACCOUNT_ID \\"
echo "   CLOUDFLARE_API_TOKEN=\$CLOUDFLARE_API_KEY \\"
echo "   wrangler pages deploy cloudflare-pages --project-name=nyc-free-food-tracker"
echo ""
echo "⚠️ 安全提示："
echo "- 将 .env 添加到 .gitignore"
echo "- 不要分享 .env 文件"
echo "- 定期轮换 API 密钥"
echo ""
echo "🚀 开始设置..."