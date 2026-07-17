# Games

A Preact and Vite collection of local pass-and-play games. Available games
include Imposter and One Night Werewolf.
The deployed app is available at
[arnavdugar.github.io/games](https://arnavdugar.github.io/games/).

## Development

```sh
pnpm install
pnpm dev
```

The Vite base path is `/games/` to match the GitHub Pages deployment. Wouter
provides hash-based routes, including `/games/#/imposter` and
`/games/#/one-night-werewolf`.

## Build

```sh
pnpm typecheck
pnpm build
```

The production output is written to `dist/games/`.
The Vite PWA plugin generates and registers the production service worker and
web app manifest as part of this build.

## Deployment

Pushes to `main` are built and deployed to GitHub Pages by the
[`deploy.yaml`](.github/workflows/deploy.yaml) workflow. Configure the repository's
Pages source as **GitHub Actions** under **Settings > Pages**.
