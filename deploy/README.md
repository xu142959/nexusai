# NexusAI 部署指南

## 架构

```
用户浏览器
    │
    ▼
Nginx (80/443)
    ├── /          → 前端静态文件 (packages/nexusai/web/dist)
    ├── /api/      → NexusAI 后端 (127.0.0.1:3000)
    └── /v1/       → NexusAI 后端 (OpenAI 兼容接口)
```

## 1. 构建前端

```bash
cd packages/nexusai/web
npm install
npm run build
# 产物在 packages/nexusai/web/dist/
```

## 2. 部署静态文件

将 `dist/` 目录复制到服务器：

```bash
rsync -avz packages/nexusai/web/dist/ user@server:/var/www/nexusai/dist/
```

## 3. 配置 Nginx

复制 `deploy/nginx.conf` 到 `/etc/nginx/conf.d/nexusai.conf`，修改：
- `server_name` 改为你的域名
- `root` 路径与实际部署路径一致

测试并重载：
```bash
nginx -t
nginx -s reload
```

## 4. 启动后端

```bash
# 在后端目录
./new-api --port 3000
```

建议用 systemd 管理：

```ini
# /etc/systemd/system/nexusai.service
[Unit]
Description=NexusAI Backend
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/nexusai
ExecStart=/opt/nexusai/new-api --port 3000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
systemctl enable nexusai
systemctl start nexusai
```

## 5. HTTPS（Let's Encrypt）

```bash
certbot --nginx -d nexusai.dev
```

Certbot 会自动修改 Nginx 配置，添加 443 监听和 SSL 证书。

## 6. 环境变量

前端品牌配置在：

```
packages/nexusai/web/src/nexusai/config/brand.ts
```

## 7. 验证清单

- [ ] `npm run build` 成功，dist/ 有输出
- [ ] Nginx 静态文件可访问（首页加载）
- [ ] `/api/status` 返回 NexusAI 状态 JSON
- [ ] `/v1/models` 需要 Bearer token
- [ ] 注册/登录流程正常
- [ ] 聊天流式响应正常（SSE）
- [ ] HTTPS 证书有效

