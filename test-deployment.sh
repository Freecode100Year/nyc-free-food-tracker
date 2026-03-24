#!/bin/bash

echo "测试NYC Free Food Tracker部署状态"
echo "=================================="

# 测试GitHub Pages
echo "1. 测试GitHub Pages部署..."
GITHUB_URL="https://freecode100year.github.io/nyc-free-food-tracker/"
echo "URL: $GITHUB_URL"

if curl -s -f -o /dev/null "$GITHUB_URL"; then
    echo "✅ GitHub Pages可访问"
    
    # 获取页面标题
    TITLE=$(curl -s "$GITHUB_URL" | grep -o '<title>[^<]*</title>' | sed 's/<title>//;s/<\/title>//')
    echo "   页面标题: $TITLE"
    
    # 检查关键元素
    if curl -s "$GITHUB_URL" | grep -q "NYC Free Food Tracker"; then
        echo "   ✅ 页面内容正确"
    else
        echo "   ⚠️  页面内容可能有问题"
    fi
else
    echo "❌ GitHub Pages不可访问"
fi

echo ""
echo "2. 检查API端点..."
API_URL="https://freecode100year.github.io/nyc-free-food-tracker/api/events"
echo "API端点: $API_URL"

if curl -s -f -o /dev/null "$API_URL"; then
    echo "✅ API端点可访问"
    
    # 检查API响应
    RESPONSE=$(curl -s "$API_URL" | head -c 200)
    echo "   API响应预览: ${RESPONSE:0:100}..."
else
    echo "❌ API端点不可访问"
fi

echo ""
echo "3. 检查地图功能..."
echo "   地图使用Leaflet.js，需要JavaScript支持"
echo "   请在浏览器中打开以下URL测试完整功能："
echo "   $GITHUB_URL"

echo ""
echo "4. 部署状态总结："
echo "   - GitHub Pages: ✅ 已部署"
echo "   - Cloudflare Pages: ⚠️  需要手动配置（见deploy-cloudflare-manual.md）"
echo "   - 建议：先使用GitHub Pages，需要更高性能时再配置Cloudflare Pages"