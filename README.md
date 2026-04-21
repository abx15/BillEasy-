# BillEasy

A large-scale SaaS billing software for Indian small businesses.

## Monorepo Setup (Turborepo)
- apps/web: Next.js 15
- apps/api: NestJS
- apps/ml-api: FastAPI
- packages/*: Shared types and utilities
- infra/*: Docker, Nginx, Scripts

## Available Scripts
- `pnpm dev`: Start all apps in dev mode
- `pnpm build`: Build all apps
- `pnpm lint`: Lint all apps
- `pnpm test`: Test all apps

## Setup Steps
1. Copy `.env.example` to `.env` and populate variables
2. Run `pnpm install`
3. Run `docker-compose up -d postgres redis`
4. Run `pnpm dev`