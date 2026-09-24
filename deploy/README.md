# NexusAI 部署指南

## 架构

NexusAI 默认是**单二进制部署**：后端（Go，监听 3000）通过 `go:embed` 同时提供前端页面（`web/dist`）与全部 API（`/api/*`、`/v1/*`），因此直接反代 3000 端口即可，不需要单独部署静态文件。

```
用户浏览器
    │
    ▼
反代（Nginx / Caddy，可选，80/443）
    │
    ▼
NexusAI 单二进制 (127.0.0.1:3000)
    ├── 前端页面（go:embed web/dist）
    ├── /api/      → 管理端 API
    └── /v1/       → OpenAI 兼容接口
```

如需把前端静态文件拆出来由 Nginx 直接托管（仅此场景），可参考 `deploy/nginx.conf`。

## 1. 构建

```bash
cd packages/nexusai/web
bun install
bun run build
# 产物在 packages/nexusai/web/dist/，会被 go:embed 打进后端二进制
```

## 2. 构建后端二进制

```bash
cd packages/nexusai
go build -o main .
# 产物：packages/nexusai/main（单二进制，包含前端）
```

## 3. 启动

```bash
# 默认监听 3000
./main

# 指定端口
./main --port 3000
```

建议用 systemd 管理：

```ini
# /etc/systemd/system/nexusai.service
[Unit]
Description=NexusAI
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/nexusai
ExecStart=/opt/nexusai/main
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
systemctl enable nexusai
systemctl start nexusai
```

## 4. 反向代理（可选）

单二进制已监听 3000，只需把 80/443 流量反代到 `127.0.0.1:3000`：

- Nginx：参考 `deploy/nginx.conf`（去掉静态文件部分，`/`、`/api/`、`/v1/` 全部 `proxy_pass http://127.0.0.1:3000`）
- Caddy：见仓库根目录 `Caddyfile`（默认 `reverse_proxy {$UPSTREAM:127.0.0.1:3000}`）

HTTPS 可使用 `certbot --nginx -d 你的域名` 自动签发。

## 5. 环境变量

- 首次启动前务必设置强随机密钥，参考根目录 `.env.example`（`SESSION_SECRET`、`CRYPTO_SECRET`，未设置时程序会拒绝启动）
- 前端品牌配置在 `packages/nexusai/web/src/nexusai/config/brand.ts`

## 6. 验证清单

- [ ] `bun run build` 成功，`web/dist/` 有输出
- [ ] `go build -o main .` 成功
- [ ] 启动后首页可访问（go:embed 前端）
- [ ] `/api/status` 返回 NexusAI 状态 JSON（公开）
- [ ] `/v1/models` 需要 Bearer token
- [ ] 注册/登录流程正常
- [ ] 聊天流式响应正常（SSE，反代需关闭缓冲）
- [ ] HTTPS 证书有效（如配置）
