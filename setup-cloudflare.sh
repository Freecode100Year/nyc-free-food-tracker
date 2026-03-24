#!/bin/bash

echo "🔧 Cloudflare 部署设置脚本"
echo "================================"

# 创建 cloudflare-deploy 目录
echo "📁 创建部署目录..."
mkdir -p cloudflare-deploy
cp -r cloudflare-pages/* cloudflare-deploy/

# 创建 _worker.js 用于 Pages Functions（可选）
echo "⚙️ 创建 Cloudflare Functions 配置..."
cat > cloudflare-deploy/_worker.js << 'EOF'
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 可以在这里添加 API 端点
    if (url.pathname === '/api/locations') {
      return new Response(JSON.stringify({
        message: "NYC Food Locations API",
        status: "ok",
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 默认返回静态文件
    return env.ASSETS.fetch(request);
  }
};
EOF

# 创建 wrangler.toml 配置
echo "📝 创建 Wrangler 配置文件..."
cat > wrangler.toml << EOF
name = "nyc-free-food-tracker"
compatibility_date = "2024-03-22"
pages_build_output_dir = "cloudflare-deploy"

[env.production]
workers_dev = false

[[build]]
command = "echo 'No build needed'"
EOF

echo ""
echo "✅ 设置完成！"
echo ""
echo "📋 下一步："
echo ""
echo "1. 获取 Cloudflare API 令牌："
echo "   https://dash.cloudflare.com/profile/api-tokens"
echo "   选择 'Edit Cloudflare Workers' 模板"
echo ""
echo "2. 配置 Wrangler："
echo "   wrangler config"
echo "   输入你的邮箱和 API 令牌"
echo ""
echo "3. 部署到 Cloudflare Pages："
echo "   wrangler pages deploy cloudflare-deploy --project-name=nyc-free-food-tracker"
echo ""
echo "4. 或者使用网页上传："
echo "   上传 'cloudflare-deploy' 文件夹到 Cloudflare Pages"
echo ""
echo "🌐 部署后访问：https://nyc-free-food-tracker.pages.dev"
echo ""
echo "🔧 如需完整后端，可部署到 Railway/Render："
echo "   cd .. && git push railway main"