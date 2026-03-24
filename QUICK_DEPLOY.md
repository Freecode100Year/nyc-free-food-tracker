# 🚀 快速部署指南 - NYC Free Food Tracker

## 方法一：GitHub + Cloudflare Pages（最简单）

### 步骤 1: 创建 GitHub 仓库
```bash
# 初始化 Git
git init
git add .
git commit -m "Initial commit: NYC Free Food Tracker"

# 创建 GitHub 仓库（在网页上）
# 然后连接本地仓库
git remote add origin https://github.com/你的用户名/nyc-free-food-tracker.git
git branch -M main
git push -u origin main
```

### 步骤 2: Cloudflare Pages 设置
1. 访问 https://dash.cloudflare.com/
2. 登录你的账户
3. 进入 **Pages** → **Create a project**
4. 选择 **Connect to Git**
5. 选择你的 GitHub 仓库
6. 构建设置：
   - **Framework preset**: None
   - **Build command**: (留空)
   - **Build output directory**: `cloudflare-pages`
7. 点击 **Save and Deploy**

### 步骤 3: 等待部署完成
部署完成后，你的应用将在以下地址可用：
```
https://nyc-free-food-tracker.pages.dev
```

## 方法二：直接上传（无需 GitHub）

### 步骤 1: 准备部署文件
```bash
# 确保在项目目录
cd nyc-free-food-tracker

# 创建部署包
zip -r deploy.zip cloudflare-pages/
```

### 步骤 2: 网页上传
1. 访问 https://dash.cloudflare.com/
2. Pages → Create a project → Direct upload
3. 上传 `deploy.zip` 文件
4. 项目名称: `nyc-free-food-tracker`
5. 点击 **Deploy site**

## 方法三：命令行部署（需要 API 令牌）

### 步骤 1: 获取 API 令牌
1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 创建新令牌，选择 "Edit Cloudflare Workers" 模板
3. 复制令牌

### 步骤 2: 配置 Wrangler
```bash
# 安装 Wrangler
npm install -g wrangler

# 配置
wrangler config
# 输入邮箱: sj9292008133@gmail.com
# 输入 API 令牌: [粘贴你的令牌]
```

### 步骤 3: 部署
```bash
cd nyc-free-food-tracker
wrangler pages deploy cloudflare-pages --project-name=nyc-free-food-tracker
```

## 🔧 自定义域名（可选）

部署后，你可以：
1. 进入 Pages 项目设置
2. 选择 **Custom domains**
3. 添加你的域名（如 food.yourdomain.com）
4. 按照提示配置 DNS

## 📱 应用功能

部署后的应用包含：
- ✅ 交互式 NYC 地图
- ✅ 48小时食物地点过滤
- ✅ 分类筛选（食品分发点/即取即走/社区冰箱）
- ✅ 响应式设计
- ✅ 示例数据

## 🔄 更新应用

### 通过 GitHub（自动）
```bash
git add .
git commit -m "Update features"
git push origin main
# Cloudflare 会自动重新部署
```

### 手动更新
1. 修改 `cloudflare-pages/index.html`
2. 重新上传到 Cloudflare Pages

## 🆘 故障排除

### 常见问题：
1. **部署失败**：检查 `cloudflare-pages` 目录是否存在
2. **页面空白**：检查浏览器控制台错误
3. **地图不显示**：确保网络可以访问 Leaflet CDN

### 获取帮助：
- Cloudflare 文档：https://developers.cloudflare.com/pages/
- GitHub Issues：报告问题
- 联系支持：support@cloudflare.com

## 🎉 开始使用！

选择最适合你的方法，开始部署吧！应用将在几分钟内上线。

**建议**：使用方法一（GitHub + Cloudflare Pages），这样可以：
- 自动部署
- 版本控制
- 回滚能力
- 团队协作