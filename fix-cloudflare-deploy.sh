#!/bin/bash

echo "修复Cloudflare Pages部署问题..."
echo "================================"

# 检查当前目录
echo "当前目录: $(pwd)"
echo ""

# 1. 同步public目录到cloudflare-pages目录
echo "1. 同步文件到Cloudflare Pages目录..."
rm -rf cloudflare-pages/*
cp -r public/* cloudflare-pages/
echo "✅ 文件同步完成"
echo ""

# 2. 确保Cloudflare Pages配置正确
echo "2. 更新Cloudflare Pages配置..."
cat > cloudflare-pages/_config.yml << 'EOF'
# Cloudflare Pages Configuration
name: nyc-free-food-tracker
production_branch: main
build_command: echo "No build needed for static site"
output_dir: .
root_dir: cloudflare-pages
EOF
echo "✅ 配置更新完成"
echo ""

# 3. 检查文件编码
echo "3. 检查文件编码..."
for file in cloudflare-pages/*.html cloudflare-pages/*.js cloudflare-pages/*.css; do
    if [ -f "$file" ]; then
        echo "  $file: $(file -i "$file" | cut -d: -f2)"
    fi
done
echo ""

# 4. 修复编码问题
echo "4. 修复编码问题..."
for file in cloudflare-pages/*.html cloudflare-pages/*.js cloudflare-pages/*.css; do
    if [ -f "$file" ]; then
        echo "  修复: $file"
        # 转换为UTF-8
        iconv -f us-ascii -t utf-8 "$file" -o "${file}.utf8" 2>/dev/null && mv "${file}.utf8" "$file"
        # 清理特殊字符
        sed -i 's/[^[:print:]]//g' "$file" 2>/dev/null
        echo "  ✅ 完成"
    fi
done
echo ""

# 5. 验证关键函数
echo "5. 验证关键函数..."
echo "  检查selectLocation函数:"
if grep -q "function selectLocation" cloudflare-pages/index.html; then
    echo "  ✅ selectLocation函数在HTML中"
elif [ -f cloudflare-pages/js/app.js ] && grep -q "function selectLocation" cloudflare-pages/js/app.js; then
    echo "  ✅ selectLocation函数在app.js中"
else
    echo "  ❌ 未找到selectLocation函数"
fi
echo ""

# 6. 创建部署包
echo "6. 创建部署包..."
zip -r deploy-pages.zip cloudflare-pages/
echo "✅ 部署包创建完成: deploy-pages.zip ($(wc -c < deploy-pages.zip) 字节)"
echo ""

# 7. 部署指南
echo "7. Cloudflare Pages部署指南:"
echo ""
echo "方法A: 通过GitHub自动部署"
echo "=========================="
echo "1. 访问 https://dash.cloudflare.com/"
echo "2. Workers & Pages → Create application → Pages"
echo "3. Connect to Git → 选择你的GitHub仓库"
echo "4. 构建设置:"
echo "   - 框架预设: None"
echo "   - 构建命令: (留空)"
echo "   - 构建输出目录: cloudflare-pages"
echo "   - 根目录: (留空)"
echo "5. Save and Deploy"
echo ""
echo "方法B: 直接上传ZIP文件"
echo "======================"
echo "1. 访问 https://dash.cloudflare.com/"
echo "2. Workers & Pages → Create application → Pages"
echo "3. 选择 '直接上传'"
echo "4. 上传: deploy-pages.zip"
echo "5. 设置构建输出目录为 '/'"
echo "6. Save and Deploy"
echo ""
echo "方法C: 使用Wrangler CLI"
echo "======================"
echo "1. 安装: npm install -g wrangler"
echo "2. 登录: wrangler login"
echo "3. 部署: wrangler pages deploy cloudflare-pages --project-name=nyc-free-food-tracker"
echo ""
echo "部署URL: https://nyc-free-food-tracker.pages.dev"
echo ""

# 8. 测试本地预览
echo "8. 本地测试..."
echo "  启动本地服务器测试:"
echo "  cd cloudflare-pages && python3 -m http.server 8080"
echo "  然后访问: http://localhost:8080"
echo ""

echo "修复完成！请按照上述指南部署到Cloudflare Pages。"