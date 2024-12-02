# PS.Foodbook.Frontend

This is a [Next.js](https://nextjs.org/) project.

## Directory Structure

`├──`[`.github`](.github) — GitHub configuration including CI/CD workflows<br>
`├──`[`.husky`](.husky) — Husky configuration including commit hooks<br>
`├──`[`.vscode`](.vscode) — VSCode settings including code snippets, recommended
extensions etc.<br> `├──`[`app`](./app) — Web application front-end built with
[React](https://react.dev/) and
[Tailwind CSS](https://tailwindcss.com/docs/installation/)<br>
`├──`[`next.config.js`](./next.config.js) — NextJS configuration<br>
`├──`[`package.json`](./package.json) — Workspace settings and dependencies<br>
`├──`[`postcss.config.ts`](./postcss.config.ts) — PostCSS configuration<br>
`├──`[`tailwind.config.ts`](./tailwind.config.ts) — Tailwind CSS
configuration<br> `├──`[`tsconfig.json`](./tsconfig.json) — TypeScript
configuration<br>

## Tech Stack

- [Next.js](https://react.dev/),
  [Tailwind CSS](https://tailwindcss.com/docs/installation/),
  [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/), [Prettier](https://prettier.io/),
  [Heroicons 2](https://github.com/tailwindlabs/heroicons)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Requirements

- [Node.js](https://nodejs.org/en/download) v18+
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [VS Code](https://code.visualstudio.com/)- Optionally
  [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
  and
  [Reactime](https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga?hl=en)
  browser extensions

## Getting Started

Check if correct version of node (18+) and npm (9.6+) are installed

```bash
node -v
```

```bash
npm -v
```

Clone repository and install project dependencies:

```bash
git clone https://github.com/Ps-in-foodservice/PS.Foodbook.Frontend.git
cd ./PS.Foodbook.Frontend

npm install
```

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

This project uses
[`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to
automatically optimize and load Inter, a custom Google Font.

## Scripts

- `npm run dev` — Launches the app in development mode on
  [`http://localhost:3000/`](http://localhost:3000/)
- `npm run build` — Compiles and bundles the app for deployment
- `npm run start` — Start a production server
- `npm run prettier` — Prettify the code using Prettier
- `npm run lint` — Validate the code using ESLint

## Docker support

First, make sure Docker Desktop is installed and running. Then run:

```bash
docker-compose up --build
```

## Naming Conventions

- Pascal case for file names and component names

  - **File name:** FilterButton.tsx
  - **Component name:** FilterButton

## Publish on Server

### Local

Build the Next.js App

```bash
npm run build
```

### On Server

- First install [Node.js](https://nodejs.org/) - Choose LTS
- Install IIS via Windows Features
- Install URL Rewrite Module for IIS
- Install PM2

```bash
npm install pm2 -g
pm2 install pm2-windows-startup
pm2 status
```

- Copy Files and folders from Local to Server:

`├──`.next/ - Built production files<br> `├──` public/ - Static files<br> `├──`
package.json - Project configuration<br> `├──` .env - Environment file<br> `├──`
ecosystem.config.js - PM2 Configuration file<br> `├──` server.js - Custom server
file<br> `└──` web.config - IIS configuration<br>

- Install only production dependencies

```bash
npm install --production
```

- Run the App with PM2

```bash
pm2 start nextjs
```
