#!/bin/bash

echo "🔐 GitHub 安全配置脚本"
echo "======================"

echo ""
echo "⚠️ 重要安全步骤："
echo ""
echo "1. 立即撤销刚才分享的令牌："
echo "   访问: https://github.com/settings/tokens"
echo "   找到 'github_pat_11BJQWKJQ0...'"
echo "   点击 'Revoke'"
echo ""
echo "2. 创建新令牌（最小权限）："
echo "   点击 'Generate new token'"
echo "   选择 'Fine-grained tokens'"
echo "   权限设置："
echo "     - Repository access: Only select repositories"
echo "     - Permissions:"
echo "       • Contents: Read and write"
echo "       • Metadata: Read-only"
echo "       • Pages: Read and write (如果需要)"
echo "   生成并立即复制令牌"
echo ""
echo "3. 使用环境变量存储："
echo "   export GITHUB_TOKEN=你的新令牌"
echo "   export GITHUB_EMAIL=sj9292008133@gmail.com"
echo ""
echo "4. 创建 .env 文件（不要提交到 Git）："
cat > .env.github << 'EOF'
# GitHub Credentials (DO NOT COMMIT!)
GITHUB_TOKEN=你的GitHub令牌
GITHUB_EMAIL=sj9292008133@gmail.com
GITHUB_USERNAME=你的GitHub用户名
GITHUB_REPO=nyc-free-food-tracker

# Cloudflare Pages 部署配置
CLOUDFLARE_PROJECT_NAME=nyc-free-food-tracker
CLOUDFLARE_PAGES_DIR=cloudflare-pages
EOF

echo "✅ 已创建 .env.github 模板"
echo ""
echo "📋 安全使用 GitHub API："
echo ""
echo "方法 A: 使用环境变量"
echo "-------------------"
echo "source .env.github"
echo "curl -H \"Authorization: token \$GITHUB_TOKEN\" \\"
echo "     -H \"Accept: application/vnd.github.v3+json\" \\"
echo "     https://api.github.com/user"
echo ""
echo "方法 B: 创建 GitHub 仓库"
echo "-----------------------"
echo "curl -X POST \\"
echo "  -H \"Authorization: token \$GITHUB_TOKEN\" \\"
echo "  -H \"Accept: application/vnd.github.v3+json\" \\"
echo "  https://api.github.com/user/repos \\"
echo "  -d '{\"name\":\"nyc-free-food-tracker\",\"description\":\"NYC Free Food Tracker\"}'"
echo ""
echo "方法 C: 推送代码"
echo "--------------"
echo "git remote set-url origin https://\$GITHUB_TOKEN@github.com/\$GITHUB_USERNAME/\$GITHUB_REPO.git"
echo "git push origin main"
echo ""
echo "🔒 最佳安全实践："
echo "- 使用 Fine-grained tokens（细粒度令牌）"
echo "- 只给必要仓库的权限"
echo "- 设置令牌过期时间"
echo "- 使用环境变量，不要硬编码"
echo "- 定期轮换令牌"
echo ""
echo "🚀 开始安全配置..."