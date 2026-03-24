#!/usr/bin/env python3
"""
NYC Free Food Tracker 自动部署脚本
肖勤立bot 创建
"""

import os
import json
import subprocess
import sys
from pathlib import Path

def print_step(step, message):
    """打印步骤信息"""
    print(f"\n{'='*50}")
    print(f"📋 步骤 {step}: {message}")
    print(f"{'='*50}")

def run_command(cmd, check=True):
    """运行命令并处理输出"""
    print(f"🔄 执行: {cmd}")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode != 0 and check:
            print(f"❌ 错误: {result.stderr}")
            return None
        return result.stdout.strip()
    except Exception as e:
        print(f"❌ 异常: {e}")
        return None

def setup_github():
    """配置 GitHub"""
    print_step(1, "GitHub 配置")
    
    # 检查是否已初始化 Git
    if not Path(".git").exists():
        print("初始化 Git 仓库...")
        run_command("git init")
        run_command("git add .")
        run_command('git commit -m "初始提交: NYC 48-Hour Free Food Tracker"')
    
    # 获取 GitHub 信息
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token:
        github_token = input("请输入 GitHub 令牌: ").strip()
    
    github_username = os.getenv("GITHUB_USERNAME")
    if not github_username:
        # 通过 API 获取用户名
        cmd = f'curl -s -H "Authorization: token {github_token}" https://api.github.com/user'
        result = run_command(cmd, check=False)
        if result:
            try:
                user_data = json.loads(result)
                github_username = user_data.get("login")
                print(f"👤 检测到 GitHub 用户: {github_username}")
            except:
                github_username = input("请输入 GitHub 用户名: ").strip()
    
    repo_name = "nyc-free-food-tracker"
    
    # 创建 GitHub 仓库
    print(f"创建 GitHub 仓库: {github_username}/{repo_name}")
    
    repo_data = {
        "name": repo_name,
        "description": "NYC 48-Hour Free Food Tracker - Find free food locations in NYC",
        "private": False,
        "has_issues": True,
        "has_projects": False,
        "has_wiki": False,
        "auto_init": False
    }
    
    # 检查仓库是否已存在
    check_cmd = f'curl -s -H "Authorization: token {github_token}" https://api.github.com/repos/{github_username}/{repo_name}'
    check_result = run_command(check_cmd, check=False)
    
    if check_result and '"message":"Not Found"' not in check_result:
        print(f"✅ 仓库已存在: https://github.com/{github_username}/{repo_name}")
    else:
        # 创建新仓库
        create_cmd = f'''curl -s -X POST \
          -H "Authorization: token {github_token}" \
          -H "Accept: application/vnd.github.v3+json" \
          https://api.github.com/user/repos \
          -d '{json.dumps(repo_data)}' '''
        
        create_result = run_command(create_cmd, check=False)
        if create_result and '"name"' in create_result:
            print(f"✅ 仓库创建成功: https://github.com/{github_username}/{repo_name}")
        else:
            print("⚠️  仓库创建可能失败，继续...")
    
    # 设置远程仓库
    remote_url = f"https://{github_token}@github.com/{github_username}/{repo_name}.git"
    run_command(f"git remote remove origin 2>/dev/null || true")
    run_command(f"git remote add origin {remote_url}")
    
    # 推送代码
    print("推送代码到 GitHub...")
    run_command("git branch -M main 2>/dev/null || git branch -M master")
    push_result = run_command("git push -u origin main 2>/dev/null || git push -u origin master", check=False)
    
    if push_result and "Everything up-to-date" in push_result or "To https://" in push_result:
        print("✅ 代码推送成功！")
    else:
        print("⚠️  推送可能需要手动处理")
    
    return github_username, repo_name

def setup_cloudflare():
    """配置 Cloudflare"""
    print_step(2, "Cloudflare 配置")
    
    print("""
请手动完成 Cloudflare Pages 配置：

1. 访问 https://dash.cloudflare.com/
2. 登录（邮箱: sj9292008133@gmail.com）
3. 进入 Pages → Create a project
4. 选择 'Connect to Git'
5. 授权 Cloudflare 访问 GitHub
6. 选择你的仓库
7. 构建设置：
   - Build command: (留空)
   - Build output directory: cloudflare-pages
8. 点击 'Save and Deploy'

部署完成后，你的应用将在以下地址可用：
https://nyc-free-food-tracker.pages.dev
    """)

def create_env_file():
    """创建环境变量文件"""
    print_step(3, "环境变量配置")
    
    env_content = """# GitHub 配置
GITHUB_USERNAME=你的GitHub用户名
GITHUB_TOKEN=你的GitHub令牌

# Cloudflare 配置
CLOUDFLARE_EMAIL=sj9292008133@gmail.com
CLOUDFLARE_ACCOUNT_ID=e3c8c6f5f5f5f5f5f5f5f5f5f5f5f5f

# 应用配置
APP_NAME="NYC Free Food Tracker"
APP_VERSION="1.0.0"

# 注意：不要提交此文件到 Git！
# 添加到 .gitignore: echo ".env.deploy" >> .gitignore
"""
    
    with open(".env.deploy", "w") as f:
        f.write(env_content)
    
    print("✅ 已创建 .env.deploy 文件")
    print("请编辑此文件并填入你的凭证")

def main():
    """主函数"""
    print("🚀 NYC Free Food Tracker 自动部署脚本")
    print("肖勤立bot 创建")
    print("="*50)
    
    # 检查当前目录
    if not Path("package.json").exists():
        print("❌ 请在项目根目录运行此脚本")
        return
    
    # 创建环境变量文件
    create_env_file()
    
    # 配置 GitHub
    try:
        github_username, repo_name = setup_github()
    except Exception as e:
        print(f"❌ GitHub 配置失败: {e}")
        github_username = "你的用户名"
        repo_name = "nyc-free-food-tracker"
    
    # 配置 Cloudflare
    setup_cloudflare()
    
    # 完成提示
    print_step(4, "部署完成")
    print(f"""
🎉 部署流程完成！

📊 项目信息：
- GitHub 仓库: https://github.com/{github_username}/{repo_name}
- Cloudflare Pages: https://{repo_name}.pages.dev

🔧 后续更新：
1. 修改代码
2. git add .
3. git commit -m "更新说明"
4. git push origin main
5. Cloudflare 会自动重新部署

🆘 需要帮助？
- GitHub 文档: https://docs.github.com
- Cloudflare Pages: https://developers.cloudflare.com/pages/
- 联系: 肖勤立bot

开始帮助纽约市民找到免费食物吧！ 🍎🥫🥖
    """)

if __name__ == "__main__":
    main()