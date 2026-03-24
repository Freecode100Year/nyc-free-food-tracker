#!/bin/bash

echo "🚀 部署静态网站到 Cloudflare Pages"
echo "================================"

# 设置变量
CLOUDFLARE_ACCOUNT_ID="e3c8c6f5f5f5f5f5f5f5f5f5f5f5f5f"
CLOUDFLARE_API_TOKEN="cfut_U4P7mcCRPgbDkt8d9x1IJSIKeJF74NFFfDARsv4Ge9697a01"
PROJECT_NAME="nyc-free-food-tracker"
DEPLOY_DIR="_site"

echo "📊 部署信息："
echo "   项目: $PROJECT_NAME"
echo "   目录: $DEPLOY_DIR"
echo "   账户ID: $CLOUDFLARE_ACCOUNT_ID"
echo ""

# 检查目录
if [ ! -d "$DEPLOY_DIR" ]; then
    echo "❌ 部署目录不存在: $DEPLOY_DIR"
    exit 1
fi

echo "📁 目录内容："
ls -la "$DEPLOY_DIR/"
echo ""

# 创建 ZIP 文件
echo "📦 创建部署包..."
ZIP_FILE="deploy-static.zip"
cd "$DEPLOY_DIR" && zip -r "../$ZIP_FILE" ./* > /dev/null
cd ..
echo "✅ 部署包创建完成: $ZIP_FILE ($(stat -f%z "$ZIP_FILE" 2>/dev/null || stat -c%s "$ZIP_FILE" 2>/dev/null) 字节)"
echo ""

# 尝试使用 Pages API 部署
echo "📤 尝试部署到 Cloudflare Pages..."
echo "注意：这可能需要 Pages 权限的 API 令牌"
echo ""

# 方法1: 使用 curl 直接上传
echo "方法1: 直接上传到 Pages API"
echo "--------------------------"

API_RESPONSE=$(curl -s -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PROJECT_NAME/deployments" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "files=@$ZIP_FILE" \
  -F 'manifest={
    "routes": [
      {"path": "/*", "file": "index.html"}
    ]
  }')

echo "API 响应: $API_RESPONSE"
echo ""

# 方法2: 如果 API 失败，提供手动部署指南
echo "方法2: 手动部署指南"
echo "-----------------"
echo ""
echo "如果自动部署失败，请手动操作："
echo ""
echo "1. 登录 Cloudflare Dashboard:"
echo "   https://dash.cloudflare.com/login"
echo "   邮箱: sj9292008133@gmail.com"
echo ""
echo "2. 进入 Pages:"
echo "   https://dash.cloudflare.com/?to=/:account/pages"
echo ""
echo "3. 创建项目:"
echo "   - 点击 'Create a project'"
echo "   - 选择 'Direct upload'"
echo "   - 项目名称: $PROJECT_NAME"
echo ""
echo "4. 上传文件:"
echo "   - 选择 '$DEPLOY_DIR' 文件夹"
echo "   - 或上传 '$ZIP_FILE' ZIP 文件"
echo ""
echo "5. 点击 'Deploy site'"
echo ""
echo "🌐 部署后访问:"
echo "   https://$PROJECT_NAME.pages.dev"
echo ""
echo "🎯 建议：如果自动部署失败，使用手动方法最可靠！"