# crypto-prices

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/)

## Requirements

- **Node.js 22.0.0 or higher** - This project requires Node.js version 22 or higher
- **Bun 1.0.0 or higher** - Package manager and runtime

## Overview

Crypto-Prices is a sleek, intuitive crypto tracker that puts the market at your fingertips. On launch, it instantly surfaces the top 20 digital assets and lets you switch currencies between USD, EUR or CLP in a single tap. Its clean, mobile-first interface adapts to your preference with a smooth dark/light toggle and offers full English and Spanish support.

## Deployment

Your project is deployed on Vercel:

**[https://v0-crypto-prices-liart.vercel.app/](https://v0-crypto-prices-liart.vercel.app/)**

## Getting Started

1. **Check Node.js version**: Run `bun dev check-node` to verify you have Node.js 22+
2. **Install dependencies**: `bun install`
3. **Set up environment variables**: Copy `env.example` to `.env.local` and configure as needed
4. **Start development**: `bun dev`

## Environment Variables

The project uses the following environment variables:

### Required

- `NEXT_PUBLIC_BASE_URL` - Base URL for the application (default: `http://localhost:3000` for development)

### Optional

- `COINGECKO_API_KEY` - CoinGecko API key (only needed for paid plans)
- `NODE_ENV` - Node.js environment (development/production)

See `env.example` for a complete list of available environment variables.
