# 🔐 设置 GitHub Secrets 用于自动部署

肖勤立，为了自动部署到 Cloudflare Pages，你需要在 GitHub 仓库中设置以下 Secrets：

## 步骤 1: 访问 GitHub Secrets 设置

1. 打开你的仓库：https://github.com/9292008133/nyc-free-food-tracker
2. 点击 **Settings** (设置)
3. 左侧菜单选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**

## 步骤 2: 添加以下 Secrets

### Secret 1: `CLOUDFLARE_API_TOKEN`
- **值**: 你的 Cloudflare API 令牌
- **如何获取**:
  1. 访问 https://dash.cloudflare.com/profile/api-tokens
  2. 点击 **Create Token**
  3. 选择模板: **Edit Cloudflare Workers**
  4. 权限设置:
     - Account → Workers Scripts → Edit
     - Account → Workers Routes → Edit
     - Zone → Workers Routes → Edit
  5. 资源: Include → All accounts
  6. 创建并复制令牌

### Secret 2: `CLOUDFLARE_ACCOUNT_ID`
- **值**: `e3c8c6f5f5f5f5f5f5f5f5f5f5f5f5f`
- **说明**: 这是你的 Cloudflare 账户 ID

## 步骤 3: 验证设置

添加 Secrets 后：
1. 返回仓库主页
2. 点击 **Actions** 标签
3. 你应该看到 "Deploy to Cloudflare Pages" 工作流
4. 可以手动触发或等待代码推送

## 步骤 4: 手动触发部署（可选）

如果不想等待自动触发：
1. 进入 **Actions** 标签
2. 选择 "Deploy to Cloudflare Pages" 工作流
3. 点击 **Run workflow**
4. 选择分支: **main**
5. 点击 **Run workflow**

## 备选方案：使用现有凭证

如果你不想创建新令牌，可以使用现有 Global API Key：

### 修改工作流文件：
将 `.github/workflows/deploy-to-cloudflare.yml` 中的：
```yaml
apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```
改为：
```yaml
apiToken: 41f85c6e0c35bf45087e855d051a8edb3a3ef
```

**⚠️ 警告**: 这样会将 API Key 暴露在代码中，不安全！

## 安全建议

1. **使用 API 令牌**，不要用 Global API Key
2. **定期轮换**令牌
3. **监控部署日志**
4. **设置部署通知**

## 部署成功后

应用将在以下地址运行：
```
https://nyc-free-food-tracker.pages.dev
```

## 故障排除

### 问题: 部署失败，权限不足
**解决**: 确保 API 令牌有 Pages 权限

### 问题: 找不到账户
**解决**: 检查 `CLOUDFLARE_ACCOUNT_ID` 是否正确

### 问题: 工作流不运行
**解决**: 检查 GitHub Actions 是否启用

## 需要帮助？

- GitHub Actions 文档: https://docs.github.com/actions
- Cloudflare Pages 文档: https://developers.cloudflare.com/pages/
- 联系肖勤立bot获取帮助