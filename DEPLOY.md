# 部署指南 - NYC Free Food Tracker

## 部署选项

### 选项1: 本地运行（最简单）
```bash
cd nyc-free-food-tracker
npm install
npm start
# 访问 http://localhost:3000
```

### 选项2: 部署到 Cloudflare Workers（推荐）

#### 步骤1: 安装 Wrangler CLI
```bash
npm install -g wrangler
```

#### 步骤2: 登录 Cloudflare
```bash
wrangler login
```

#### 步骤3: 创建 wrangler.toml 配置文件
```bash
cat > wrangler.toml << EOF
name = "nyc-free-food-tracker"
compatibility_date = "2024-03-01"
main = "cloudflare-worker.js"

[[build]]
command = "echo 'Building...'"
EOF
```

#### 步骤4: 部署到 Cloudflare Workers
```bash
wrangler deploy
```

#### 步骤5: 配置自定义域名（可选）
在 Cloudflare Dashboard 中为 Worker 配置自定义域名。

### 选项3: 部署到 VPS/云服务器

#### 步骤1: 上传代码到服务器
```bash
scp -r nyc-free-food-tracker user@your-server:/path/to/app
```

#### 步骤2: 在服务器上安装和运行
```bash
cd /path/to/app/nyc-free-food-tracker
npm install
npm start
```

#### 步骤3: 使用 PM2 保持进程运行
```bash
npm install -g pm2
pm2 start server.js --name "nyc-food-tracker"
pm2 save
pm2 startup
```

#### 步骤4: 配置 Nginx 反向代理（可选）
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 选项4: 部署到 Railway/Render/Heroku

这些平台支持简单的 Node.js 部署：

1. 连接 GitHub 仓库
2. 设置环境变量（如果需要）
3. 部署按钮点击

## 环境变量配置

如果需要配置 API 密钥或其他敏感信息：

```bash
# 创建 .env 文件
echo "NYC_API_KEY=your_api_key" > .env
echo "PORT=3000" >> .env
```

在 server.js 中读取：
```javascript
require('dotenv').config();
const PORT = process.env.PORT || 3000;
```

## 生产环境优化建议

1. **启用压缩**：
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **设置安全头**：
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

3. **启用 CORS**（如果需要跨域）：
   ```javascript
   const cors = require('cors');
   app.use(cors());
   ```

4. **添加日志记录**：
   ```javascript
   const morgan = require('morgan');
   app.use(morgan('combined'));
   ```

## 监控和维护

1. **健康检查端点**：
   ```javascript
   app.get('/health', (req, res) => {
     res.json({ status: 'ok', timestamp: new Date() });
   });
   ```

2. **设置自动重启**（使用 PM2）：
   ```bash
   pm2 monit  # 监控面板
   pm2 logs   # 查看日志
   ```

## 故障排除

### 常见问题：

1. **端口被占用**：
   ```bash
   lsof -i :3000  # 查看占用进程
   kill -9 <PID>  # 结束进程
   ```

2. **内存不足**：
   ```bash
   # 增加 Node.js 内存限制
   node --max-old-space-size=4096 server.js
   ```

3. **API 请求失败**：
   - 检查网络连接
   - 验证 API 端点是否可访问
   - 查看服务器日志

### 日志位置：
- PM2 日志：`~/.pm2/logs/`
- Nginx 日志：`/var/log/nginx/`
- 应用日志：控制台输出或自定义日志文件

## 备份策略

1. **代码备份**：使用 Git 仓库
2. **数据库备份**（如果添加数据库）：
   ```bash
   # 定期备份脚本
   0 2 * * * pg_dump mydb > /backups/mydb-$(date +%Y%m%d).sql
   ```

3. **配置文件备份**：备份 .env 和服务器配置

---

**注意**：部署前请确保：
- 已安装 Node.js 16+
- 防火墙已开放相应端口
- 域名 DNS 已正确配置
- SSL 证书已配置（生产环境必须）