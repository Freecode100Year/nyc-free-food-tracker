#!/bin/bash

echo "🚀 直接部署到 Cloudflare Pages"
echo "=============================="

# 使用环境变量
export CLOUDFLARE_ACCOUNT_ID="e3c8c6f5f5f5f5f5f5f5f5f5f5f5f5f"
export CLOUDFLARE_API_TOKEN="41f85c6e0c35bf45087e855d051a8edb3a3ef"  # Global API Key

echo "📊 账户信息："
echo "账户ID: $CLOUDFLARE_ACCOUNT_ID"
echo ""

# 检查是否安装了 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "安装 wrangler..."
    npm install -g wrangler@latest
fi

echo "🔧 尝试方法 1: 使用 wrangler pages deploy"
echo "---------------------------------------"

# 创建临时配置文件
cat > wrangler-pages.toml << EOF
name = "nyc-free-food-tracker"
compatibility_date = "2024-03-22"

[pages]
bucket = "./cloudflare-pages"
EOF

# 尝试部署
echo "执行部署命令..."
wrangler pages deploy cloudflare-pages --project-name=nyc-free-food-tracker 2>&1 | tee deploy.log

echo ""
echo "🔧 尝试方法 2: 使用 curl 直接上传"
echo "--------------------------------"

# 检查 cloudflare-pages 目录
if [ -d "cloudflare-pages" ]; then
    echo "✅ cloudflare-pages 目录存在"
    echo "文件列表:"
    ls -la cloudflare-pages/
    
    # 创建 ZIP 文件
    echo "创建部署包..."
    zip -r deploy.zip cloudflare-pages/ > /dev/null
    echo "✅ 部署包创建完成: deploy.zip ($(stat -f%z deploy.zip 2>/dev/null || stat -c%s deploy.zip 2>/dev/null) 字节)"
else
    echo "❌ cloudflare-pages 目录不存在"
    exit 1
fi

echo ""
echo "🔧 尝试方法 3: 使用 Cloudflare API"
echo "--------------------------------"

# 尝试获取项目信息
echo "检查现有项目..."
curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/nyc-free-food-tracker" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    if data.get('success'):
        print('✅ 项目存在')
        print(f'   名称: {data[\"result\"][\"name\"]}')
        print(f'   子域名: {data[\"result\"].get(\"subdomain\", \"未设置\")}')
    else:
        print('❌ 项目不存在或无法访问')
except:
    print('❌ API 调用失败')
"

echo ""
echo "🎯 部署选项总结："
echo ""
echo "如果上述方法失败，需要："
echo "1. 创建专门的 Pages API 令牌"
echo "2. 或通过网页界面部署"
echo ""
echo "🌐 部署后地址："
echo "https://nyc-free-food-tracker.pages.dev"
echo ""
echo "建议：如果命令行部署失败，使用网页上传最快！"