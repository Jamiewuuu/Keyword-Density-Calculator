# GitHub Pages 404 错误 - 故障排除指南

## 🔍 问题诊断

**问题描述：** https://jamiewuuu.github.io/whatanai/ 显示 404 Not Found

**可能的原因（按常见度排序）：**
1. GitHub Pages 尚未部署完成（仍在处理中）
2. GitHub Pages 设置未正确配置
3. 仓库是 Private（私有）而非 Public（公开）
4. main 分支的文件结构不正确
5. PR 尚未合并到 main 分支

## 🛠️ 排查步骤

### 第 1 步：检查 PR 是否已合并到 main

**检查方法：**

```bash
# 在本地检查 main 分支是否有最新代码
git fetch origin
git checkout main
git log --oneline -10
```

**预期输出：**
应该看到包含 "Deploy Keyword Density Calculator as homepage" 的提交

**如果没有：**
- 需要先合并 PR 到 main
- 或直接推送当前代码到 main

### 第 2 步：检查 GitHub 仓库的 Pages 设置

**访问路径：**
```
https://github.com/Jamiewuuu/whatanai/settings/pages
```

**需要检查的设置：**

1. **Source (源)**
   - ✅ 确保选择 "Deploy from a branch"
   - ❌ 不要选择 "GitHub Actions"

2. **Branch (分支)**
   - ✅ Branch: `main`
   - ✅ Folder: `/ (root)`
   - 点击 "Save" 保存

3. **页面状态**
   - 如果看到蓝色框显示 "Your site is live at..." - 说明部署成功
   - 如果看到黄色框显示 "Your site is being built..." - 需要等待 1-3 分钟
   - 如果看到红色错误框 - 记录错误信息并查看 Actions 日志

### 第 3 步：检查仓库可见性（Public/Private）

**访问路径：**
```
https://github.com/Jamiewuuu/whatanai/settings
```

**检查要点：**
- 滚动到页面底部的 "Danger Zone"
- 如果看到 "Make public" 按钮 - 说明当前是 Private
- 如果看到 "Make private" 按钮 - 说明已经是 Public

**GitHub Pages 要求：**
- 免费账户的 GitHub Pages 需要仓库为 **Public**（公开）
- Private 仓库需要 Pro 账户才能使用 Pages

**如果是 Private，可以：**
1. 点击 "Change visibility" > "Make public"
2. 确认更改（注意：会公开所有代码）
3. 重新配置 Pages（Settings > Pages）

### 第 4 步：检查 main 分支的文件结构

**访问路径：**
```
https://github.com/Jamiewuuu/whatanai/tree/main
```

**必须存在的文件：**
```
✅ index.html          (首页)
✅ keyword-density.js  (核心逻辑)
✅ keyword-density.css (样式)
```

**正确的目录结构示例：**
```
whatanai/
├── index.html              ← 必须存在
├── keyword-density.js      ← 必须存在
├── keyword-density.css     ← 必须存在
├── keyword-density.html    ← 可选
├── REDESIGN-SUMMARY.md     ← 文档
├── README.md               ← 文档
└── backup/                 ← 备份目录
    └── ...
```

**常见错误：**
- ❌ index.html 不在 main 分支
- ❌ 文件路径错误（如在子目录中）
- ❌ index.html 文件名错误（如 INDEX.html 或 Index.html）

### 第 5 步：检查 GitHub Actions 部署日志

**访问路径：**
```
https://github.com/Jamiewuuu/whatanai/actions
```

**需要查找的 Workflow：**
- "pages build and deployment"
- "GitHub Pages" 相关的 workflow

**检查日志：**
1. 点击最新的 workflow run
2. 查看状态：
   - ✅ 绿色对勾：部署成功
   - 🟡 黄色圆圈：正在部署中
   - ❌ 红色叉号：部署失败
3. 如果失败，点击展开查看具体错误

**常见错误：**
```
# 错误 1：无权访问
Error: Unable to build page. Please try again later.
解决：检查仓库是否为 Public

# 错误 2：文件未找到
Error: index.html not found
解决：确认 main 分支有 index.html

# 错误 3：权限问题
Error: Permission denied
解决：检查 Pages 设置是否正确
```

### 第 6 步：等待部署完成

**正常部署时间线：**

1. **合并 PR 后：**
   - 0-30 秒：GitHub 检测到代码变更
   - 30-60 秒：开始部署（Actions 中可以看到）

2. **部署过程中：**
   - 1-2 分钟：构建和部署
   - 状态："Your site is being built..."

3. **部署完成后：**
   - 2-3 分钟：显示 "Your site is live at..."
   - 可以访问：https://jamiewuuu.github.io/whatanai/

**如果5分钟后仍404：**
- 按照上面的步骤检查配置
- 清除浏览器缓存（Ctrl+Shift+R 或 Cmd+Shift+R）

## 🎯 快速修复方案

### 方案 A：直接推送 main 分支

如果 PR 尚未合并，可以直接推送当前代码到 main：

```bash
# 在 guangzhou 目录中执行
cd /Users/wuyujie/workspace/whatanai/.conductor/guangzhou

# 推送到 main（需要确认）
git push origin Jamiewuuu/keyword-density-calculator:main --force
```

**注意：** 强制推送 main 会直接覆盖，谨慎操作

### 方案 B：重新触发部署

```bash
# 创建空提交重新触发部署
git commit --allow-empty -m "Re-trigger GitHub Pages deployment"
git push origin Jamiewuuu/keyword-density-calculator
```

### 方案 C：检查 GitHub 状态

访问 GitHub 状态页面：
```
https://www.githubstatus.com/
```

检查是否有 Pages 服务中断

## 📊 验证清单

按顺序检查，直到问题解决：

- [ ] 1. PR 已合并到 main 分支
- [ ] 2. Repository 是 Public（不是 Private）
- [ ] 3. Settings > Pages 已正确配置（Branch: main, Folder: /）
- [ ] 4. main 分支包含 index.html 文件
- [ ] 5. Actions 中没有部署错误
- [ ] 6. 等待至少 5 分钟后重试访问
- [ ] 7. 清除浏览器缓存或尝试无痕模式
- [ ] 8. 使用 curl 命令测试：
      ```bash
      curl -I https://jamiewuuu.github.io/whatanai/
      ```

## 🔧 如果以上方法都无效

**终极解决方案：**

1. **删除并重新创建 Pages 配置：**
   - 进入 Settings > Pages
   - 将 Source 改为另一个分支（如 gh-pages）
   - 保存，等待几秒钟
   - 再改回 main 分支，保存

2. **手动启用 Actions：**
   - 进入 Actions 标签页
   - 检查是否有任何 workflow 被禁用
   - 启用 "GitHub Pages" workflow

3. **联系 GitHub 支持：**
   - 如果 24 小时后仍然 404
   - 访问：https://support.github.com/
   - 提交支持请求

## 📝 记录排查结果

请记录以下信息：

1. **PR 状态：** (已合并/未合并)
2. **仓库类型：** (Public/Private)
3. **Pages 设置状态：**
   - Source: ___________
   - Branch: ___________
   - Status message: ___________
4. **Actions 状态：** (成功/失败/进行中)
5. **等待时间：** ___________ 分钟
6. **错误信息：** ___________

将这些信息粘贴到 GitHub Issue 或支持请求中，可以更快获得帮助。

---

**文档版本：** v1.0
**最后更新：** 2025-12-09
**问题状态：** 排查中
