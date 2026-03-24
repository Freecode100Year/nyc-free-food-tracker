# 手动部署到Cloudflare Pages

由于API密钥可能已失效，请按照以下步骤手动部署到Cloudflare Pages：

## 步骤1：访问Cloudflare控制台
1. 登录 https://dash.cloudflare.com/
2. 选择你的账户（sj9292008133@gmail.com）

## 步骤2：创建Pages项目
1. 在左侧菜单选择 "Workers & Pages"
2. 点击 "Create application" → "Pages"
3. 点击 "Connect to Git"

## 步骤3：连接GitHub仓库
1. 选择GitHub作为Git提供者
2. 授权Cloudflare访问你的GitHub账户
3. 选择仓库：`Freecode100Year/nyc-free-food-tracker`

## 步骤4：配置构建设置
- **项目名称**: nyc-free-food-tracker (或自定义)
- **生产分支**: main
- **构建设置**:
  - **框架预设**: None
  - **构建命令**: (留空)
  - **构建输出目录**: `cloudflare-pages`
  - **根目录**: (留空)

## 步骤5：部署
1. 点击 "Save and Deploy"
2. 等待构建完成
3. 访问生成的URL（格式：`https://nyc-free-food-tracker.pages.dev`）

## 替代方案：直接上传ZIP文件
如果Git连接有问题，可以：
1. 下载部署包：`deploy-pages.zip`
2. 在Cloudflare Pages中选择 "直接上传"
3. 上传ZIP文件
4. 设置构建输出目录为 `/`

## 网站URL
- GitHub Pages: https://freecode100year.github.io/nyc-free-food-tracker/
- Cloudflare Pages: 部署后获得（如：https://nyc-free-food-tracker.pages.dev）

## 注意事项

### API服务
1. **GitHub Pages**: 只提供静态文件服务，API端点不可用
2. **Cloudflare Pages**: 同样只提供静态文件服务
3. **完整后端API**: 需要单独部署到：
   - Cloudflare Workers（推荐）
   - Vercel
   - Railway
   - 或其他Node.js托管服务

### 完整部署方案
1. **前端（静态网站）**: 部署到GitHub Pages或Cloudflare Pages
2. **后端API**: 部署到Cloudflare Workers（使用`cloudflare-worker.js`）
3. **数据库**: 使用Cloudflare D1、Supabase或MongoDB Atlas

### 快速测试
当前部署只包含前端静态页面。要测试完整功能：
1. 克隆仓库到本地
2. 运行 `npm install && npm start`
3. 访问 http://localhost:3000

### 环境变量
如果部署完整后端，需要设置：
- `MONGODB_URI`: MongoDB连接字符串
- `JWT_SECRET`: JWT签名密钥
- `MAPBOX_TOKEN`: Mapbox访问令牌（可选）