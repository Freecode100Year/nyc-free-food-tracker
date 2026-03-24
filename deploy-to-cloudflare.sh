#!/bin/bash

echo "🚀 开始部署 NYC Free Food Tracker 到 Cloudflare Pages..."
echo "======================================================"

# 检查是否安装了 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "📦 安装 Cloudflare Wrangler CLI..."
    npm install -g wrangler
fi

# 登录 Cloudflare（如果需要）
echo "🔐 检查 Cloudflare 登录状态..."
wrangler whoami 2>/dev/null || {
    echo "请登录 Cloudflare..."
    wrangler login
}

# 创建必要的目录
echo "📁 准备部署文件..."
mkdir -p cloudflare-deploy
cp -r cloudflare-pages/* cloudflare-deploy/

# 显示部署说明
echo ""
echo "✅ 准备完成！"
echo ""
echo "📋 部署步骤："
echo ""
echo "方法1: 使用 Cloudflare Dashboard"
echo "1. 访问 https://dash.cloudflare.com/"
echo "2. 进入 Pages → Create a project"
echo "3. 选择 'Direct upload'"
echo "4. 上传 'cloudflare-deploy' 文件夹"
echo "5. 项目名称: nyc-free-food-tracker"
echo "6. 点击 'Deploy site'"
echo ""
echo "方法2: 使用 Wrangler CLI"
echo "1. 确保在项目根目录"
echo "2. 运行: wrangler pages deploy cloudflare-deploy --project-name=nyc-free-food-tracker"
echo ""
echo "方法3: 使用 GitHub（推荐）"
echo "1. 创建 GitHub 仓库"
echo "2. 将代码推送到仓库"
echo "3. 在 Cloudflare Pages 中连接 GitHub 仓库"
echo "4. 构建设置:"
echo "   - Build command: (留空)"
echo "   - Build output directory: cloudflare-pages"
echo "5. 点击 'Save and Deploy'"
echo ""
echo "🌐 部署完成后，你的应用将在以下地址可用："
echo "https://nyc-free-food-tracker.pages.dev"
echo ""
echo "🔧 如果需要 API 后端，可以考虑："
echo "1. 使用 Cloudflare Workers 创建 API"
echo "2. 使用现有的 NYC Open Data API"
echo "3. 部署 Node.js 版本到其他平台（Railway, Render, Heroku）"
echo ""
echo "📞 需要帮助？访问 https://developers.cloudflare.com/pages/"