# 外链提交任务系统

这是一个自动化外链提交任务管理系统，用于将多个产品推广到指定的100个网站平台。

## 📁 目录结构

```
task_link_submission/
├── config.json                    # 任务配置文件
├── data/
│   ├── websites/
│   │   └── websites.json         # 100个网站账号信息
│   ├── products/
│   │   ├── products.json         # 10个产品信息
│   │   └── logos/                # 产品Logo存储目录
│   └── templates/
│       └── submission_form.md     # 提交格式说明
├── logs/                         # 任务执行日志
├── submission_records/
│   └── status.json               # 提交状态追踪
├── scripts/                      # 自动化脚本（后期添加）
└── reports/                      # 任务报告
```

## 📝 文件说明

### 配置文件
- **config.json**: 系统配置，包含延迟设置、重试次数、文件路径等
- **websites.json**: 存储所有100个目标网站的账号信息和提交规则
- **products.json**: 存储10个产品的详细信息、描述模板
- **status.json**: 实时追踪任务进度和完成情况

## 🚀 使用方法

### 1. 准备工作
```bash
# 上传Logo文件
cp your_logos/*.png data/products/logos/

# 更新网站账号信息（websites.json）
# 更新产品信息（products.json）
```

### 2. 数据录入
1. 将100个网站信息录入到 `data/websites/websites.json`
2. 将10个产品信息录入到 `data/products/products.json`
3. 上传对应的产品Logo到 `data/products/logos/` 目录

### 3. 执行提交
```bash
# 后期添加的脚本执行命令
python scripts/submit_links.py
```

### 4. 监控进度
查看 `submission_records/status.json` 了解实时进度和结果

## 📊 数据格式

### 网站信息格式
支持多种提交类型：
- `profile_link`: 个人资料链接
- `business_listing`: 商业清单
- `product_submission`: 产品提交
- `directory_submission`: 目录提交

### 产品信息格式
支持多种描述模板：
- 简短描述：`short_description`（50-100字符）
- 中等描述：`description`（100-300字符）
- 详细描述：`long_description`（300-1000字符）

## 📈 状态追踪

系统会实时更新以下状态信息：
- ✅ 成功提交数量
- ❌ 失败提交数量
- ⏸️ 跳过的网站
- 📊 总体进度百分比
- 📝 详细的提交日志

## 🔒 安全说明

- 账号密码信息已加密存储
- 支持代理设置避免风控
- 智能延迟避免频繁操作
- 详细的日志记录便于调试

## 📋 后期扩展

建议后续添加的功能：
- CSV/XLSX文件导入支持
- 批量Logo上传工具
- 智能重试机制
- 失败原因分析
- 成功提交验证
- 网站可用性检查
- 自动报告生成
- API接口对接

## 📞 技术支持

如遇问题请检查：
1. 网络连接状态
2. 账号登录信息
3. 网站结构变化
4. 提交字段映射
5. Logo文件格式

---

**注意**: 这是一个自动化外链提交系统，请合理使用，遵守各平台的用户协议，避免过度营销行为。