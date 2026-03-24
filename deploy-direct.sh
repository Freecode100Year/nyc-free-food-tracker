#!/bin/bash

echo "🚀 直接部署到 Cloudflare Pages"
echo "=============================="

CLOUDFLARE_EMAIL="sj9292008133@gmail.com"
CLOUDFLARE_API_KEY="41f85c6e0c35bf45087e855d051a8edb3a3ef"
CLOUDFLARE_ACCOUNT_ID="e3c8c6f5f5f5f5f5f5f5f5f5f5f5f5f"
PROJECT_NAME="nyc-free-food-tracker"

echo "📊 账户信息："
echo "邮箱: $CLOUDFLARE_EMAIL"
echo "账户ID: $CLOUDFLARE_ACCOUNT_ID"
echo "项目: $PROJECT_NAME"
echo ""

# 检查项目是否存在
echo "🔍 检查项目状态..."
PROJECT_INFO=$(curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PROJECT_NAME" \
  -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
  -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
  -H "Content-Type: application/json")

if echo "$PROJECT_INFO" | grep -q '"success":true'; then
    echo "✅ 项目存在"
    SUBDOMAIN=$(echo "$PROJECT_INFO" | python3 -c "import json,sys; data=json.load(sys.stdin); print(data['result'].get('subdomain', '未分配'))")
    echo "   子域名: $SUBDOMAIN.pages.dev"
else
    echo "❌ 项目不存在或无法访问"
    echo "响应: $PROJECT_INFO"
    echo ""
    echo "请先在 Cloudflare Dashboard 中创建项目："
    echo "1. 访问 https://dash.cloudflare.com/"
    echo "2. Pages → Create a project"
    echo "3. 项目名称: $PROJECT_NAME"
    echo "4. 选择 'Direct upload'"
    exit 1
fi

echo ""
echo "📦 准备部署文件..."
if [ -f "deploy-pages.zip" ]; then
    echo "✅ 部署包已存在: deploy-pages.zip"
    FILESIZE=$(stat -f%z deploy-pages.zip 2>/dev/null || stat -c%s deploy-pages.zip 2>/dev/null)
    echo "   文件大小: $((FILESIZE / 1024)) KB"
else
    echo "❌ 部署包不存在"
    exit 1
fi

echo ""
echo "📤 尝试部署..."
echo "注意：Cloudflare Pages API 可能需要特殊权限或使用不同的端点。"
echo ""
echo "备选方案："
echo ""
echo "方案 A: 网页上传（最简单）"
echo "-------------------------"
echo "1. 访问 https://dash.cloudflare.com/"
echo "2. Pages → $PROJECT_NAME"
echo "3. Deployments → 'Deploy a new version'"
echo "4. 选择 'Upload assets'"
echo "5. 上传 cloudflare-pages 文件夹或 deploy-pages.zip"
echo ""
echo "方案 B: 使用 Wrangler CLI"
echo "-----------------------"
echo "1. 创建 API 令牌：https://dash.cloudflare.com/profile/api-tokens"
echo "2. 运行: wrangler config"
echo "3. 部署: wrangler pages deploy cloudflare-pages --project-name=$PROJECT_NAME"
echo ""
echo "方案 C: 手动部署到其他平台"
echo "-------------------------"
echo "1. Railway.app: railway up"
echo "2. Render.com: 连接 GitHub 仓库"
echo "3. Vercel: vercel --prod"
echo ""
echo "🌐 部署后访问: https://$PROJECT_NAME.pages.dev"
echo ""
echo "建议使用方案 A（网页上传），最直接可靠。"