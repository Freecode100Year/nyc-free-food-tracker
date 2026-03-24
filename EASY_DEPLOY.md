# 🎯 最简单部署指南 - 3分钟上线

## 方法一：网页上传（推荐给肖勤立）

### 步骤 1: 登录 Cloudflare
1. 访问 https://dash.cloudflare.com/
2. 使用邮箱: `sj9292008133@gmail.com`
3. 使用密码或 API 密钥登录

### 步骤 2: 进入 Pages
1. 左侧菜单点击 **Pages**
2. 点击 **Create a project**

### 步骤 3: 选择上传方式
1. 选择 **Direct upload**
2. 点击 **上传文件夹**

### 步骤 4: 选择文件夹
1. 找到 `nyc-free-food-tracker/cloudflare-pages` 文件夹
2. 选择并上传

### 步骤 5: 配置项目
- **项目名称**: `nyc-free-food-tracker`
- **生产分支**: `main`
- **构建设置**: 保持默认（无需构建命令）
- 点击 **Save and Deploy**

### 步骤 6: 等待部署
部署完成后，你会看到：
```
✅ 部署成功！
访问地址: https://nyc-free-food-tracker.pages.dev
```

## 方法二：GitHub 自动部署（未来更新方便）

### 步骤 1: 创建 GitHub 仓库
```bash
cd nyc-free-food-tracker
git init
git add .
git commit -m "初始提交"
# 在 GitHub.com 创建新仓库
git remote add origin https://github.com/你的用户名/nyc-free-food-tracker.git
git push -u origin main
```

### 步骤 2: Cloudflare 连接 GitHub
1. Pages → Create project → Connect to Git
2. 授权 Cloudflare 访问 GitHub
3. 选择你的仓库
4. 构建设置:
   - Build command: (留空)
   - Build output directory: `cloudflare-pages`
5. 点击 **Save and Deploy**

## 📱 应用功能预览

部署后你的应用将包含：

### 🗺️ 地图功能
- 纽约市交互式地图
- 三种地点标记：
  - 🟢 绿色：食品分发点
  - 🟠 橙色：即取即走
  - 🟣 紫色：社区冰箱
- 点击标记显示详情

### ⏰ 时间过滤
- 48小时倒计时显示
- 只显示未来48小时内开放的地点
- 实时更新时间

### 🎛️ 分类筛选
- 全部地点
- 食品分发点
- 即取即走
- 社区冰箱

### 📱 响应式设计
- 手机友好界面
- 平板电脑适配
- 桌面端优化

## 🔧 后续更新

### 更新静态版本
1. 修改 `cloudflare-pages/index.html`
2. 重新上传到 Cloudflare Pages
3. 自动重新部署

### 添加后端 API
如果需要真实数据：
1. 创建 Cloudflare Worker
2. 添加 `/api/locations` 端点
3. 连接 NYC Open Data API
4. 更新前端调用

## 🆘 常见问题

### Q: 页面显示空白？
A: 检查浏览器控制台，确保可以访问 Leaflet CDN

### Q: 地图不加载？
A: 可能需要等待几秒钟，或刷新页面

### Q: 如何自定义域名？
A: Pages 项目设置 → Custom domains → 添加你的域名

### Q: 如何查看访问统计？
A: Pages 项目 → Analytics

## 📞 获取帮助

- Cloudflare 支持: https://support.cloudflare.com/
- Pages 文档: https://developers.cloudflare.com/pages/
- GitHub Issues: 报告问题

## 🎉 立即开始！

**建议**: 使用方法一（网页上传），3分钟内即可上线！

你的应用将在以下地址运行：
```
https://nyc-free-food-tracker.pages.dev
```

开始帮助纽约市民找到免费食物吧！ 🍎🥫🥖