# NexusAI

一站式 AI 模型接入平台，支持 500+ 模型，统一 API 接口。

## 技术栈

### 前端
- React 19 + TypeScript
- rsbuild 2（构建工具）
- Tailwind CSS 4
- TanStack Router 7
- Zustand 5 + TanStack Query 5
- Motion 12（动画）
- Recharts 3（图表）
- i18next（国际化，7 种语言）
- lucide-react（图标）

### 后端
- Go 1.25 + Gin
- GORM + PostgreSQL 16
- Redis 7（缓存/限流）
- JWT 认证

## 功能特性

### 用户端
- 首页 - 产品展示、热门模型、代码示例
- 聊天 - SSE 流式对话、多对话管理、参数调节
- 模型列表 - 搜索、筛选、按提供商分组
- 排行榜 - 模型热度排名
- 定价 - 充值方案、按量计费说明
- 文档 - API 文档、快速开始、错误码
- 控制台 - API 密钥、用量统计、个人资料、充值

## 快速开始

### 本地开发

# 1. 启动后端
cd packages/nexusai
go run main.go

# 2. 启动前端（另一个终端）
cd web
npm install
npm run dev

访问 http://localhost:3000

### Docker 部署

# 1. 复制环境变量配置
cp .env.example .env
# 编辑 .env，修改 SESSION_SECRET 和 CRYPTO_SECRET

# 2. 构建并启动
docker-compose up -d --build

访问 http://localhost:3000

## 路由说明

| 路径 | 说明 |
|------|------|
| / | 用户端首页 |
| /models | 模型列表 |
| /chat | AI 聊天 |
| /plans | 定价说明 |
| /rankings | 排行榜 |
| /docs | API 文档 |
| /console/* | 用户控制台 |
| /sign-in | 登录 |
| /sign-up | 注册 |

## 品牌定制

修改 web/src/nexusai/config/brand.ts 即可更换品牌名称、颜色、导航等。

## 测试

cd packages/nexusai/web
npm test

## License

AGPL-3.0

