# Setup

This repository is a Vite React TypeScript app configured for GitHub Pages.

## Create the App

For a new empty repository, scaffold the app with:

```sh
npm create vite@latest . -- --template react-ts
npm install
```

Because this repository already existed with `README.md` and `LICENSE`, the app in this repo was scaffolded into a temporary directory and copied into the repo root:

```sh
npm create vite@latest tmp/danielmajzik-vite-template -- --template react-ts
cp -R tmp/danielmajzik-vite-template/. .
rm -rf tmp
npm install
```

## Local Development

Install dependencies:

```sh
npm install
```

Start the dev server:

```sh
npm run dev
```

Build the production site:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

Run linting:

```sh
npm run lint
```

## GitHub Pages Hosting

The app deploys from `.github/workflows/deploy.yml` when changes are pushed to the `main` branch.

The workflow runs:

```sh
npm ci
npm run build
```

In GitHub, configure the repository:

1. Open the repository settings.
2. Go to **Pages**.
3. Set **Build and deployment** source to **GitHub Actions**.
4. Push to `main`.

For this username site repository, `danielmajzik.github.io`, Vite can use the default root base path. If this app is moved to a project repository, set `base: '/repository-name/'` in `vite.config.ts`.
