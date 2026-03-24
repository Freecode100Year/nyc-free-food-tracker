#!/bin/bash

echo "🚀 完整部署流程 - GitHub + Cloudflare"
echo "==================================="

echo ""
echo "📋 部署流程概览："
echo "1. 撤销旧令牌，创建新 GitHub 令牌"
echo "2. 创建 GitHub 仓库"
echo "3. 推送代码到 GitHub"
echo "4. 配置 Cloudflare Pages 连接 GitHub"
echo "5. 自动部署完成"
echo ""

echo "🔐 步骤 1: GitHub 令牌安全设置"
echo "------------------------------"
echo "请先完成："
echo "1. 访问 https://github.com/settings/tokens"
echo "2. 撤销旧令牌 'github_pat_11BJQWKJQ0...'"
echo "3. 创建新 Fine-grained token："
echo "   - Repository access: Only select repositories"
echo "   - Permissions: Contents (Read and write)"
echo "   - 生成并复制新令牌"
echo ""

read -p "是否已创建新令牌？(y/n): " token_ready
if [ "$token_ready" != "y" ]; then
    echo "请先创建新令牌，然后重新运行脚本"
    exit 1
fi

echo ""
echo "🐙 步骤 2: 创建 GitHub 仓库"
echo "--------------------------"

# 设置环境变量
read -p "输入你的 GitHub 用户名: " github_username
read -p "输入你的 GitHub 令牌: " github_token
read -p "输入仓库名称 [nyc-free-food-tracker]: " repo_name
repo_name=${repo_name:-nyc-free-food-tracker}

# 创建 .env 文件
cat > .env.deploy << EOF
GITHUB_USERNAME=$github_username
GITHUB_TOKEN=$github_token
GITHUB_REPO=$repo_name
CLOUDFLARE_EMAIL=sj9292008133@gmail.com
CLOUDFLARE_ACCOUNT_ID=e3c8c6f5f5f5f5f5f5f5f5f5f5f5f5f
EOF

# 添加到 .gitignore
if ! grep -q ".env.deploy" .gitignore; then
    echo ".env.deploy" >> .gitignore
fi

echo "✅ 环境变量已保存到 .env.deploy"
echo ""

echo "🌐 步骤 3: 通过 API 创建仓库"
echo "---------------------------"

# 创建 GitHub 仓库
create_repo_response=$(curl -s -X POST \
  -H "Authorization: token $github_token" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$repo_name\",
    \"description\": \"NYC 48-Hour Free Food Tracker - Find free food locations in NYC\",
    \"private\": false,
    \"has_issues\": true,
    \"has_projects\": false,
    \"has_wiki\": false,
    \"auto_init\": false
  }")

if echo "$create_repo_response" | grep -q "Bad credentials"; then
    echo "❌ GitHub 令牌无效"
    exit 1
elif echo "$create_repo_response" | grep -q "name already exists"; then
    echo "⚠️  仓库已存在，继续..."
else
    echo "✅ GitHub 仓库创建成功: https://github.com/$github_username/$repo_name"
fi

echo ""
echo "📤 步骤 4: 推送代码到 GitHub"
echo "---------------------------"

# 初始化 Git（如果还没初始化）
if [ ! -d ".git" ]; then
    echo "初始化 Git 仓库..."
    git init
    git add .
    git commit -m "初始提交: NYC 48-Hour Free Food Tracker
    
功能：
- 纽约市交互式地图 (Leaflet.js)
- 48小时食物地点过滤
- 分类筛选：食品分发点/即取即走/社区冰箱
- 响应式设计 (Tailwind CSS)
- 准备 Cloudflare Pages 部署"
fi

# 设置远程仓库
git remote remove origin 2>/dev/null
git remote add origin "https://$github_token@github.com/$github_username/$repo_name.git"

echo "推送代码到 GitHub..."
if git push -u origin main 2>/dev/null || git push -u origin master 2>/dev/null; then
    echo "✅ 代码推送成功！"
    echo "仓库地址: https://github.com/$github_username/$repo_name"
else
    echo "⚠️  推送失败，可能需要设置分支："
    echo "git branch -M main"
    echo "git push -u origin main"
fi

echo ""
echo "☁️ 步骤 5: Cloudflare Pages 部署"
echo "-------------------------------"
echo ""
echo "现在需要手动配置 Cloudflare Pages："
echo ""
echo "1. 访问 https://dash.cloudflare.com/"
echo "2. 登录（邮箱: sj9292008133@gmail.com）"
echo "3. 进入 Pages → Create a project"
echo "4. 选择 'Connect to Git'"
echo "5. 授权 Cloudflare 访问 GitHub"
echo "6. 选择你的仓库: $github_username/$repo_name"
echo "7. 构建设置："
echo "   - Build command: (留空)"
echo "   - Build output directory: cloudflare-pages"
echo "8. 点击 'Save and Deploy'"
echo ""
echo "⏱️  等待几分钟，部署完成后："
echo "🌐 访问: https://$repo_name.pages.dev"
echo ""
echo "🎉 部署完成！"
echo ""
echo "🔧 后续更新："
echo "git add ."
echo "git commit -m '更新说明'"
echo "git push origin main"
echo "# Cloudflare 会自动重新部署"