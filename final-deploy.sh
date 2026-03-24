#!/bin/bash

echo "🚀 最终部署 - 使用 API 令牌"
echo "=========================="

# 设置环境变量
export CLOUDFLARE_API_TOKEN="cfut_U4P7mcCRPgbDkt8d9x1IJSIKeJF74NFFfDARsv4Ge9697a01"
export CLOUDFLARE_ACCOUNT_ID="e3c8c6f5f5f5f5f5f5f5f5f5f5f5f5f"

echo "📊 使用令牌部署..."
echo "账户ID: $CLOUDFLARE_ACCOUNT_ID"
echo ""

# 检查 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "安装 wrangler..."
    npm install -g wrangler@latest
fi

echo "🔧 方法 1: 使用 wrangler pages deploy"
echo "-----------------------------------"

# 配置 wrangler
cat > wrangler.toml << EOF
name = "nyc-free-food-tracker"
compatibility_date = "2024-03-22"

[env.production]
account_id = "$CLOUDFLARE_ACCOUNT_ID"
pages_build_output_dir = "./cloudflare-pages"
EOF

echo "执行部署命令..."
wrangler pages deploy cloudflare-pages --project-name=nyc-free-food-tracker --branch=main 2>&1

echo ""
echo "🔧 方法 2: 直接 API 调用"
echo "----------------------"

# 获取项目信息
echo "检查项目状态..."
curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/nyc-free-food-tracker" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if data['success']:
    print('✅ 项目信息:')
    project = data['result']
    print(f'   名称: {project[\"name\"]}')
    print(f'   子域名: {project.get(\"subdomain\", \"未设置\")}')
    print(f'   最新部署: {project.get(\"latest_deployment\", {}).get(\"created_on\", \"无\")}')
    print(f'   🌐 访问地址: https://{project.get(\"subdomain\", \"nyc-free-food-tracker\")}.pages.dev')
else:
    print('❌ 无法获取项目信息')
"

echo ""
echo "🎯 部署完成检查："
echo "访问: https://nyc-free-food-tracker.pages.dev"
echo ""
echo "如果页面显示空白，等待几分钟让 Cloudflare 分发完成。"