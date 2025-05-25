# Icons Setup

This directory contains the Vercel-style triangle icons for the crypto-prices application.

## Files

- `favicon.svg` - Default favicon (uses currentColor)
- `favicon-light.svg` - Light mode favicon (black triangle)
- `favicon-dark.svg` - Dark mode favicon (white triangle)
- `icon-192x192.svg` - PWA icon 192x192 (white triangle on black background)
- `icon-512x512.svg` - PWA icon 512x512 (white triangle on black background)

## Features

- ✅ Light/dark mode favicon support
- ✅ PWA icon support
- ✅ SVG format for crisp display at any size
- ✅ Vercel-style triangle design

## Converting to PNG (Optional)

If you need PNG versions for better browser compatibility:

1. Upgrade to Node.js 22+
2. Run: `bun add -D sharp`
3. Run: `node scripts/convert-icons.js`

This will generate PNG versions of the PWA icons.
