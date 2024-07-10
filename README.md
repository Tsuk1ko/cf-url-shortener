# Cloudflare URL Shortener

A very simple URL shorten service.

No configuration, no management, just use it.

## Deploy

1. Fork this repository.
2. Create a [Cloudflare API Token](https://dash.cloudflare.com/profile/api-tokens) with **Edit Cloudflare Workers** template, and add **D1 edit permission** manually.
3. Set your API Token as repository secret `CLOUDFLARE_API_TOKEN`.
4. Go to **Actions** - **Deploy** - **Run workflow**, run it once.

### Setup custom domain

Go to your Cloudflare dashboard, find the `cf-url-shortener` project in **Workers & Pages**, enter the **Custom domains** tab.

### Update from upstream

Go to your forked repository, click **Sync fork** - **Update branch**.

Your Cloudflare Pages project will be update automatically when changes are made to the repository.

### Other secrets

- `ADDITION_HEAD`  
  The content will be placed in the `<head>` of the page.

## Development

Require [bun](https://bun.sh/)

### Project Setup

```sh
bun install
bun dev:init-d1
```

### Compile and Hot-Reload for Development

```sh
bun dev
```
