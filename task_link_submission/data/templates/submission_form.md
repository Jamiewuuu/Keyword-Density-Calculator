# 外链提交任务模版

## 网站账号信息格式 (websites.json)
```json
{
  "id": 1,
  "name": "网站名称",
  "url": "https://example.com",
  "login_url": "https://example.com/login",
  "submission_type": "profile_link",
  "category": "技术社区",
  "credentials": {
    "username": "你的用户名",
    "password": "你的密码"
  },
  "submission_fields": {
    "website_field": "profile_website",
    "description_field": "profile_description",
    "logo_field": "profile_avatar"
  },
  "status": "registered",
  "notes": "注册完成"
}
```

## 产品信息格式 (products.json)
```json
{
  "id": 1,
  "name": "产品名称",
  "english_name": "ProductName",
  "website_url": "https://product.com",
  "description": "产品描述",
  "short_description": "简短描述",
  "long_description": "详细描述",
  "logo": "product_logo.png",
  "category": "产品分类",
  "tags": ["标签1", "标签2"],
  "features": ["特性1", "特性2"]
}
```

## 状态追踪 (status.json)
- 总体任务进度
- 各网站提交状态
- 成功/失败记录
- 日志信息

## 使用说明
1. 首先填入你的网站账号信息到 `data/websites/websites.json`
2. 填入产品信息到 `data/products/products.json`
3. 上传产品Logo到 `data/products/logos/` 目录
4. 运行提交脚本开始任务
5. 查看 `submission_records/status.json` 了解进度
6. 查看 `logs/` 目录获取详细日志

## 支持的提交类型
- profile_link: 个人资料链接
- business_listing: 商业清单
- product_submission: 产品提交
- directory_submission: 目录提交
...等

## 注意事项
- 请确保所有账号已完成注册
- Logo文件支持: PNG, JPG, GIF 格式
- 描述内容请避免重复率过高
- 建议分批少量提交，避免风控