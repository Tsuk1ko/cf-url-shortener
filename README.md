# cfworker-url-shortener

部署在 Cloudflare Workers 的短网址服务

利用 Cloudflare 的 Workers 路由配置，可以将 `/` 路由到 GitHub Pages，`/*` 路由到 Cloudflare Workers，这样首页就不会占用 Workers 资源了

## frontend

标准的 Vue 项目，没什么好说的

附带 GitHub Actions 自动部署到 gh-pages 分支，但首次可能需要自己去 Settings 里启用一下 GitHub Pages

### Secrets

- `ADDITION_HEAD` - 会被添加到 `</head>` 前，可放置统计代码等

## backend

利用 Cloudflare Workers 提供的免费 KV 来储存

因为只是个简单的短网址服务，不会带有用户登录和统计之类的，所以本想用哈希算法来生成短链以最大程度节约 KV，但 Cloudflare Workers 的 runtime 限制很多，许多第三方库都很难用上，自己手写算法太麻烦，因此放弃了，还是简单点用随机字符吧

### KV

新建一个命名空间，绑定到 `URL_DB` 变量即可
