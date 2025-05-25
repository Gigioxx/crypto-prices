# crypto-prices

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/)

## Requirements

- **Node.js 22.0.0 or higher** - This project requires Node.js version 22 or higher
- **Bun 1.0.0 or higher** - Package manager and runtime

## Overview

Crypto-Prices is a sleek, intuitive crypto tracker that puts the market at your fingertips. On launch, it instantly surfaces the top 20 digital assets and lets you switch currencies between USD, EUR or CLP in a single tap. Its clean, mobile-first interface adapts to your preference with a smooth dark/light toggle and offers full English and Spanish support.

### ✨ Key Features

- **📱 Responsive Design**: Mobile-first interface that works seamlessly across all devices
- **🌍 Multi-language**: Full support for English and Spanish
- **🎨 Theme Support**: Dark/light mode toggle with system preference detection
- **💱 Multi-currency**: Support for USD, EUR, and CLP currencies
- **⚡ Enhanced Caching**: Smart localStorage caching for faster load times and offline resilience
- **📊 Real-time Data**: Live cryptocurrency prices with automatic updates
- **🔄 Data Status**: Clear indicators showing data freshness and last update time

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

## Documentation

📖 **[Complete Documentation Index](docs/README.md)** - Overview of all available documentation

### 📚 Core Features

- **[Caching System](docs/caching.md)** - Enhanced localStorage caching with SWR integration for faster load times and offline resilience
- **[Translations](docs/translations.md)** - Complete internationalization system supporting English and Spanish with SSR compatibility

### 🛠️ Development Scripts

- **Translation Testing**: `node scripts/test-translations.js` - Verify translation consistency between languages
- **Tool Verification**: `bun run check-tools` - Check if required development tools are installed
- **Node Version Check**: `bun run check-node` - Verify Node.js version compatibility

### 🔧 Available Commands

```bash
# Development
bun dev                 # Start development server
bun build              # Build for production
bun start              # Start production server

# Code Quality
bun run lint           # Run ESLint with auto-fix
bun run lint:check     # Check linting without fixing
bun run format         # Format code with Prettier
bun run format:check   # Check formatting without fixing
bun run type-check     # Run TypeScript type checking
bun run check-all      # Run all quality checks

# Utilities
bun run check-tools    # Verify development tools
bun run check-node     # Check Node.js version
```
