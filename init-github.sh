#!/bin/bash

echo "🐙 GitHub 仓库初始化脚本"
echo "========================"

# 检查是否已初始化 Git
if [ ! -d ".git" ]; then
    echo "初始化 Git 仓库..."
    git init
else
    echo "Git 仓库已存在"
fi

# 添加文件
echo "添加文件到 Git..."
git add .

# 提交
echo "提交更改..."
git commit -m "Initial commit: NYC 48-Hour Free Food Tracker MVP

Features:
- Interactive Leaflet.js map of NYC
- 48-hour food location filtering
- Category filters (Pantry, Grab & Go, Community Fridge)
- Responsive design with Tailwind CSS
- Sample data from NYC Open Data
- Ready for Cloudflare Pages deployment"

echo ""
echo "✅ Git 仓库已初始化！"
echo ""
echo "📋 下一步："
echo ""
echo "1. 在 GitHub 创建新仓库："
echo "   https://github.com/new"
echo "   仓库名: nyc-free-food-tracker"
echo "   描述: NYC 48-Hour Free Food Tracker web application"
echo "   选择 Public 或 Private"
echo ""
echo "2. 连接远程仓库："
echo "   git remote add origin https://github.com/YOUR_USERNAME/nyc-free-food-tracker.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. 部署到 Cloudflare Pages："
echo "   - 访问 https://dash.cloudflare.com/"
echo "   - Pages → Create project → Connect to Git"
echo "   - 选择你的仓库"
echo "   - 构建设置:"
echo "     • Build command: (empty)"
echo "     • Build output directory: cloudflare-pages"
echo ""
echo "🌐 部署完成后访问：https://nyc-free-food-tracker.pages.dev"
echo ""
echo "💡 提示："
echo "- 确保 .env 文件在 .gitignore 中"
echo "- 不要提交 API 密钥等敏感信息"
echo "- 定期提交代码更新"