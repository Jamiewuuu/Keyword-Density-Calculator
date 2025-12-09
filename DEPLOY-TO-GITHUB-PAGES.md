# GitHub Pages 部署指南

## 部署前准备

✅ **已完成步骤：**
1. 代码已提交到 GitHub 仓库：Jamiewuuu/whatanai
2. 推送分支：`Jamiewuuu/keyword-density-calculator`
3. 当前位置：/Users/wuyujie/workspace/whatanai/.conductor/guangzhou

## 部署步骤

### 第一步：在 GitHub 创建 Pull Request

1. **访问创建页面：**
   打开浏览器访问：
   ```
   https://github.com/Jamiewuuu/whatanai/pull/new/Jamiewuuu/keyword-density-calculator
   ```

2. **填写 PR 信息：**
   - **Title（标题）：**
     ```
     Deploy Keyword Density Calculator as homepage
     ```

   - **Description（描述）：**
     ```markdown
     ## Changes

     ✅ **Keyword Density Calculator 成为首页**
     - 替换 index.html 为关键词密度计算器工具
     - 移除 "Back to Home" 导航（现在本身就是首页）
     - 归档原营销页面到 backup/ 目录

     ✅ **功能特性**
     - 实时关键词密度分析（1-10词组合）
     - JSON文本提取支持
     - 红色文本关键词高亮
     - 横向滚动词数标签
     - 响应式设计（Linear App风格）
     - 统计一致性：输入单词数与Total Words完全同步

     ✅ **技术优化**
     - 添加 getCleanWordCount() 方法统一统计逻辑
     - 修复连字符复合词处理（section-divider → section, divider）
     - SEO最佳实践（符合Google分词规则）

     ℹ️ **部署说明**
     此 PR 合并后，建议配置 GitHub Pages 从 main 分支部署，
     访问地址：https://jamiewuuu.github.io/whatanai/

     ---

     🤖 Generated with [Claude Code](https://claude.com/claude-code)
     ```

3. **创建 Pull Request：**
   - 点击 "Create pull request" 按钮

### 第二步：合并 Pull Request

1. **审查 PR：**
   - 检查 Files changed 标签页，确认修改
   - 确认 23 个文件已变更

2. **合并分支：**
   - 点击 "Merge pull request" 按钮
   - 选择 "Create a merge commit"
   - 点击 "Confirm merge"

3. **删除分支（可选）：**
   - 合并后可以删除 `Jamiewuuu/keyword-density-calculator` 分支
   - 点击 "Delete branch" 按钮

### 第三步：配置 GitHub Pages

1. **访问仓库设置：**
   - 浏览器访问：https://github.com/Jamiewuuu/whatanai/settings
   - 或点击仓库页面的 "Settings" 标签

2. **导航到 Pages 设置：**
   - 在左侧菜单中，找到 "Pages"（在 "Code and automation" 部分）
   - 点击进入 GitHub Pages 设置

3. **配置部署源：**
   - **Source（源）：** 选择 "Deploy from a branch"
   - **Branch（分支）：** 选择 "main"
   - **Folder（文件夹）：** 选择 "/ (root)"
   - 点击 "Save" 保存

4. **等待部署：**
   - GitHub 会自动开始部署
   - 通常需要 1-3 分钟
   - 可以在 Actions 标签页查看部署进度

### 第四步：访问部署的网站

1. **获取访问地址：**
   - 部署成功后，访问地址：
     ```
     https://jamiewuuu.github.io/whatanai/
     ```

2. **验证功能：**
   - 网站加载正常
   - 关键词密度计算器工作正常
   - 输入文本后统计准确
   - 1-10词组合分析正常
   - 关键词高亮功能正常

## 部署验证清单

访问网站后检查以下功能：

- [ ] 网页加载正常，无错误
- [ ] 标题显示 "Keyword Density Calculator - What an AI"
- [ ] 输入框可以输入文本
- [ ] 实时单词统计与字符统计显示正常
- [ ] 点击 "Analyze Now" 后分析结果正常显示
- [ ] Total Words 统计与输入框单词数一致
- [ ] 1-10 Words 标签可以正常切换
- [ ] 关键词高亮功能正常（红色文本）
- [ ] 响应式设计正常（移动端适配）

## 故障排除

### 问题：GitHub Pages 部署失败

**现象：**
- 访问网站显示 404
- Actions 中显示部署失败

**解决方案：**
1. 检查 Branch 设置是否正确（main 分支）
2. 检查仓库是否为公开（Public）
3. 等待几分钟后重试（GitHub 缓存）
4. 查看 Actions 日志获取详细错误信息

### 问题：页面加载但功能不正常

**现象：**
- 页面能打开但 JavaScript 报错
- 分析功能无法使用

**解决方案：**
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签页的错误信息
3. 检查 network 标签确认所有资源加载正常
4. 清除浏览器缓存后重试

### 问题：样式错乱

**现象：**
- 页面布局错乱
- 样式不生效

**解决方案：**
1. 确认 TailwindCSS CDN 可以访问
2. 检查 Font Awesome CDN 是否被阻止
3. 尝试使用 VPN 访问（可能是 CDN 区域问题）

## 持续更新

后续更新代码后：

1. **本地提交：**
   ```bash
   git add -A
   git commit -m "Your update message"
   ```

2. **推送到 GitHub：**
   ```bash
   git push origin main
   ```

3. **自动部署：**
   - GitHub Pages 会自动重新部署
   - 等待 1-3 分钟生效

## 技术信息

**项目名称：** Keyword Density Calculator
**技术栈：**
- HTML5 + CSS3 (TailwindCSS 3.4 CDN)
- Vanilla JavaScript (ES6+)
- Font Awesome 6.5 Icons
- GitHub Pages 静态托管

**浏览器兼容性：**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**性能优化：**
- 使用 CDN 加速静态资源
- 最小化自定义 CSS
- 异步加载图标字体
- 响应式图片优化

## 访问统计

部署后可以通过以下方式查看访问数据：

1. **GitHub Traffic：**
   - 访问：https://github.com/Jamiewuuu/whatanai/graphs/traffic
   - 查看访问量、来源、热门内容

2. **添加 Google Analytics（可选）：**
   - 在 index.html 的 `<head>` 中添加 GA 代码
   - 获取更详细的用户行为分析

## 联系方式

如有问题或建议：
- 在 GitHub 仓库提交 Issue
- 通过邮箱联系（如有）

---

**部署日期：** 2025-12-09
**部署版本：** Keyword Density Calculator v1.0
**最后更新：** 2025-12-09 11:45 UTC
