#!/bin/bash

echo "🚀 部署 NYC Free Food Tracker 到 Cloudflare Pages"
echo "=============================================="

# 使用肖勤立的 Cloudflare 凭证
CLOUDFLARE_EMAIL="sj9292008133@gmail.com"
CLOUDFLARE_API_KEY="41f85c6e0c35bf45087e855d051a8edb3a3ef"
CLOUDFLARE_ACCOUNT_ID="e3c8c6f5f5f5f5f5f5f5f5f5f5f5f5f"

echo "📊 Cloudflare 账户信息："
echo "邮箱: $CLOUDFLARE_EMAIL"
echo "账户ID: $CLOUDFLARE_ACCOUNT_ID"
echo ""

echo "🐙 GitHub 仓库信息："
echo "仓库: https://github.com/9292008133/nyc-free-food-tracker"
echo ""

echo "📋 部署步骤："
echo ""
echo "1. 创建 Cloudflare Pages 项目"
echo "----------------------------"
echo "使用以下 API 请求创建 Pages 项目："

cat << EOF
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects" \\
  -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \\
  -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "nyc-free-food-tracker",
    "production_branch": "main",
    "build_config": {
      "build_command": "",
      "destination_dir": "cloudflare-pages",
      "root_dir": "",
      "web_analytics_tag": null,
      "web_analytics_token": null
    }
  }'
EOF

echo ""
echo "2. 连接 GitHub 仓库"
echo "------------------"
echo "这需要在 Cloudflare Dashboard 中完成："
echo "1. 访问 https://dash.cloudflare.com/"
echo "2. 登录"
echo "3. Pages → nyc-free-food-tracker → Settings"
echo "4. GitHub integration → Connect GitHub"
echo "5. 授权并选择仓库: 9292008133/nyc-free-food-tracker"
echo ""

echo "3. 手动部署（如果自动部署失败）"
echo "------------------------------"
echo "也可以直接上传 cloudflare-pages 文件夹："
echo "1. Pages → nyc-free-food-tracker → Deployments"
echo "2. 'Deploy a new version' → 'Upload assets'"
echo "3. 选择 cloudflare-pages 文件夹"
echo "4. 点击 'Deploy site'"
echo ""

echo "🌐 部署后访问："
echo "https://nyc-free-food-tracker.pages.dev"
echo ""

echo "🔧 备用方案：使用 wrangler"
echo "-------------------------"
echo "如果 API 方法不行，可以："
echo "1. 创建 API 令牌：https://dash.cloudflare.com/profile/api-tokens"
echo "2. 运行: wrangler config"
echo "3. 部署: wrangler pages deploy cloudflare-pages --project-name=nyc-free-food-tracker"
echo ""

echo "🎉 开始部署吧！"