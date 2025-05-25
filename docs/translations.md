# Spanish Translations Implementation

This document explains how Spanish translations are implemented in the Crypto Prices application.

## Overview

The application supports both English (default) and Spanish translations using a custom internationalization system that works with Next.js App Router and Server Components.

## Architecture

### 1. Translation Files

- **English**: `messages/en.json`
- **Spanish**: `messages/es.json`

Both files contain the same structure with translated content:

```json
{
  "common": {
    "loading": "Loading..." / "Cargando...",
    "error": "Error" / "Error",
    "retry": "Retry" / "Reintentar",
    "darkMode": "Dark mode" / "Modo oscuro",
    "lightMode": "Light mode" / "Modo claro"
  },
  "crypto": {
    "title": "Crypto Prices",
    "description": "Real-time cryptocurrency prices..." / "Precios de criptomonedas...",
    // ... more translations
  },
  "navigation": {
    "home": "Home" / "Inicio",
    "settings": "Settings" / "Configuración"
  }
}
```

### 2. Configuration

- **Locale Config**: `i18n/config.ts` defines supported locales (`en`, `es`) and default locale
- **Storage**: User preferences are stored in both localStorage and cookies for SSR compatibility

### 3. Core Components

#### Server-Side

- **`lib/server-locale.ts`**: Gets user's locale preference from cookies on the server
- **`lib/messages.ts`**: Provides utilities to load messages synchronously and asynchronously

#### Client-Side

- **`hooks/use-messages.ts`**: React hook that provides messages based on current locale
- **`components/settings-provider.tsx`**: Context provider for locale and currency settings
- **`components/locale-layout.tsx`**: Updates HTML lang attribute when locale changes

### 4. Dynamic Components

- **`components/dynamic-header.tsx`**: Header that updates translations when locale changes
- **`components/client-wrapper.tsx`**: Wrapper for client components that need dynamic translations

## How It Works

### Server-Side Rendering (SSR)

1. Server reads locale preference from cookies using `getServerLocale()`
2. Loads appropriate messages using `getMessagesSync()`
3. Renders initial page with correct translations
4. Generates dynamic metadata (title, description) based on locale

### Client-Side Hydration

1. Settings provider initializes with locale from localStorage/cookies
2. Dynamic components use `useMessages()` hook to get current translations
3. When user changes locale, all components automatically update
4. HTML lang attribute updates for accessibility

### Locale Switching

1. User changes locale in settings
2. New locale is saved to both localStorage and cookies
3. All client components re-render with new translations
4. HTML lang attribute updates
5. Next page load uses new locale for SSR

## Key Features

### ✅ Complete Translation Coverage

- All user-facing text is translatable
- Error messages and loading states included
- Rate limiting messages translated
- Metadata (title, description, keywords) localized

### ✅ SEO Optimized

- Dynamic metadata generation based on locale
- Proper HTML lang attribute management
- Server-side rendering with correct locale

### ✅ Accessibility

- Screen reader support with proper lang attributes
- Semantic HTML maintained across languages
- ARIA labels translated where applicable

### ✅ Performance

- Server-side locale detection
- Efficient client-side updates
- No layout shift during locale changes

## Usage

### Adding New Translations

1. Add new keys to both `en.json` and `es.json`
2. Update the `Messages` interface in `lib/messages.ts`
3. Use translations in components via `useMessages()` hook or props

### Example Component Usage

```tsx
// Server Component
export default async function MyPage() {
  const locale = await getServerLocale();
  const messages = getMessagesSync(locale);

  return <MyComponent messages={messages} />;
}

// Client Component
function MyComponent() {
  const messages = useMessages();

  if (!messages) return <div>Loading...</div>;

  return <h1>{messages.crypto.title}</h1>;
}
```

## Testing

Run the translation test script to verify consistency:

```bash
node scripts/test-translations.js
```

This checks that both language files have the same structure and displays sample translations.

## Browser Support

The translation system works in all modern browsers and gracefully falls back to English if there are any issues loading Spanish translations.

The application now provides a seamless bilingual experience for both English and Spanish users.
