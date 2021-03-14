# cfworker-url-shortener

部署在 Cloudflare Workers 的短网址服务

利用 Cloudflare 的 Workers 路由配置，可以将 `/` 路由到 GitHub Pages，`/*` 路由到 Cloudflare Workers，这样首页就不会占用 Workers 资源了

## frontend

标准的 Vue 项目，没什么好说的

附带 GitHub Actions 自动部署到 gh-pages 分支，但首次可能需要自己去 Settings 里启用一下 GitHub Pages

### Secrets

- `ADDITION_HEAD` - 会被添加到 `</head>` 前，可放置统计代码等

## backend

利用 Cloudflare Workers 提供的免费 KV 来储存，原网址长度最长 1024，产生的短网址 ID 为长度为 6 的 Base56 `23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz`

优先采用哈希算法生成 ID，每个 URL 能够通过哈希算法产生 4 个 ID，若全部已被占用则使用随机生成的 ID，最多尝试 1000 次

### KV

新建一个命名空间，绑定到 `URL_DB` 变量即可
