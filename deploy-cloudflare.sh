#!/bin/bash

# NYC Free Food Tracker - Cloudflare Pages 部署脚本
echo "准备部署 NYC Free Food Tracker 到 Cloudflare Pages..."

# 检查是否已安装 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "安装 Cloudflare Wrangler CLI..."
    npm install -g wrangler
fi

# 登录 Cloudflare
echo "登录 Cloudflare..."
wrangler login

# 创建 Cloudflare Pages 项目配置
echo "创建 Cloudflare Pages 配置..."
cat > wrangler.toml << EOF
name = "nyc-free-food-tracker"
compatibility_date = "2024-03-01"
pages_build_output_dir = "./public"

[[build]]
command = "npm run build:static"

[[build.upload]]
format = "service-worker"
EOF

# 创建静态构建脚本
echo "创建静态构建配置..."
cat > package-cloudflare.json << EOF
{
  "scripts": {
    "build:static": "mkdir -p public && cp -r views/index.html public/ && cp -r public/css public/js public/ && echo 'Static build complete'"
  }
}
EOF

echo "部署准备完成！"
echo "请运行以下命令部署到 Cloudflare Pages:"
echo "wrangler pages deploy ./public --project-name=nyc-free-food-tracker"
echo ""
echo "或者使用 GitHub 自动部署："
echo "1. 将代码推送到 GitHub 仓库"
echo "2. 在 Cloudflare Pages 中连接该仓库"
echo "3. 构建命令: npm run build:static"
echo "4. 输出目录: ./public"