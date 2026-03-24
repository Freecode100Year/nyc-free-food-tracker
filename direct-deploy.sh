#!/bin/bash

echo "🚀 直接部署到 Cloudflare Pages"
echo "=============================="

# 设置环境变量
export CLOUDFLARE_EMAIL="sj9292008133@gmail.com"
export CLOUDFLARE_API_KEY="41f85c6e0c35bf45087e855d051a8edb3a3ef"
export CLOUDFLARE_ACCOUNT_ID="e3c8c6f5f5f5f5f5f5f5f5f5f5f5f5f"

echo "📊 账户信息："
echo "邮箱: $CLOUDFLARE_EMAIL"
echo "账户ID: $CLOUDFLARE_ACCOUNT_ID"
echo ""

# 检查 cloudflare-pages 目录
if [ ! -d "cloudflare-pages" ]; then
    echo "❌ cloudflare-pages 目录不存在"
    echo "请先运行: ./setup-cloudflare.sh"
    exit 1
fi

echo "📁 准备部署文件..."
echo "目录内容:"
ls -la cloudflare-pages/

echo ""
echo "🔧 尝试部署方法..."

# 方法1: 使用 curl 直接上传到 Pages
echo ""
echo "方法1: 使用 Pages API 上传"
echo "--------------------------"
echo "这需要创建一个 Pages API 令牌..."
echo ""

# 方法2: 使用 wrangler（需要 API 令牌）
echo "方法2: 配置 Wrangler"
echo "-------------------"
echo "1. 创建 API 令牌："
echo "   访问: https://dash.cloudflare.com/profile/api-tokens"
echo "   选择 'Edit Cloudflare Workers' 模板"
echo "   复制生成的令牌"
echo ""
echo "2. 运行: wrangler config"
echo "   输入邮箱: $CLOUDFLARE_EMAIL"
echo "   输入 API 令牌: [粘贴你的令牌]"
echo ""
echo "3. 部署: wrangler pages deploy cloudflare-pages --project-name=nyc-free-food-tracker"
echo ""

# 方法3: 网页上传（最简单）
echo "方法3: 网页上传（推荐）"
echo "---------------------"
echo "1. 访问: https://dash.cloudflare.com/"
echo "2. Pages → Create a project → Direct upload"
echo "3. 选择 'cloudflare-pages' 文件夹"
echo "4. 项目名称: nyc-free-food-tracker"
echo "5. 点击 Deploy site"
echo ""
echo "🌐 部署后访问: https://nyc-free-food-tracker.pages.dev"
echo ""
echo "📦 创建部署包："
zip -r nyc-food-tracker.zip cloudflare-pages/
echo "✅ 已创建 nyc-food-tracker.zip"
echo ""
echo "🎯 建议使用网页上传方法，最简单快捷！"