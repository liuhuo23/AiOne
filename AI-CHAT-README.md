# AI 聊天功能使用指南

## 功能特性

✅ **多 AI 提供商支持**
- OpenAI (GPT-3.5, GPT-4)
- 月之暗面 Kimi
- DeepSeek

✅ **完整的聊天体验**
- 实时消息发送和接收
- 支持 Markdown 渲染
- 消息历史管理
- 流式响应支持（即将推出）

✅ **灵活的配置管理**
- 可视化设置界面
- 本地配置保存
- 实时配置测试
- 多模型选择

## 快速开始

### 1. 获取 API 密钥

选择一个 AI 提供商并获取 API 密钥：

- **OpenAI**: https://platform.openai.com/api-keys
- **月之暗面**: https://platform.moonshot.cn/console/api-keys  
- **DeepSeek**: https://platform.deepseek.com/api_keys

### 2. 配置 AI 服务

1. 点击聊天界面右上角的"设置"按钮
2. 选择您的 AI 提供商
3. 输入 API 密钥
4. 选择模型（可选）
5. 调整参数（可选）
6. 点击"测试连接"验证配置
7. 点击"保存配置"

### 3. 开始聊天

配置完成后即可开始与 AI 助手对话：
- 在输入框中输入消息
- 按 Enter 发送（Shift+Enter 换行）
- 等待 AI 响应

## 配置说明

### 提供商配置

| 提供商 | 优势 | 模型 |
|--------|------|------|
| OpenAI | 最先进的模型，响应质量高 | gpt-3.5-turbo, gpt-4, gpt-4-turbo |
| 月之暗面 | 中文支持好，价格实惠 | moonshot-v1-8k, moonshot-v1-32k, moonshot-v1-128k |
| DeepSeek | 代码能力强，价格便宜 | deepseek-chat, deepseek-coder |

### 参数说明

- **创造性 (Temperature)**: 0-2，控制响应的随机性
  - 0: 最精确、一致
  - 0.7: 平衡（推荐）
  - 2: 最创意、随机

- **最大输出长度**: 100-8192，控制单次响应的最大字符数

## 环境变量配置（可选）

如果您希望通过环境变量预设配置，可以创建 `.env.local` 文件：

```bash
# 复制 .env.example 为 .env.local
cp .env.example .env.local

# 编辑配置
vim .env.local
```

## 安全说明

⚠️ **重要提醒**：
- API 密钥保存在浏览器本地存储中
- 在生产环境中建议通过后端代理 API 调用
- 不要在公共场所或不信任的设备上输入 API 密钥
- 定期轮换 API 密钥

## 故障排除

### 常见问题

1. **连接失败**
   - 检查 API 密钥是否正确
   - 确认网络连接正常
   - 验证 API 基础URL 是否正确

2. **响应缓慢**
   - 可能是网络延迟
   - 尝试降低最大输出长度
   - 检查 API 配额是否充足

3. **配置丢失**
   - 检查浏览器是否禁用了本地存储
   - 清除浏览器缓存后需要重新配置

### 错误代码

- `401`: API 密钥无效或过期
- `429`: API 调用频率超限
- `500`: 服务器内部错误

## 开发说明

相关文件结构：
```
src/
├── components/
│   ├── AiChat.tsx           # 主聊天界面
│   └── AISettingsModal.tsx  # 设置弹窗
└── services/
    ├── openaiService.ts     # OpenAI 服务封装
    ├── aiConfigManager.ts   # 配置管理
    └── aiChatService.ts     # 通用聊天服务
```

## 更新日志

- v0.0.2: 添加 AI 聊天功能，支持多提供商
