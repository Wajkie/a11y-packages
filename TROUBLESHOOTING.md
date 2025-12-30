# Troubleshooting Guide

Common issues and solutions when using `@wajkie/a11y-core` and `@wajkie/react-a11y`.

## Installation Issues

### Cannot find module '@wajkie/a11y-core' or '@wajkie/react-a11y'

**Cause:** Package not installed or incorrect import path.

**Solution:**
```bash
npm install @wajkie/a11y-core @wajkie/react-a11y
# or
yarn add @wajkie/a11y-core @wajkie/react-a11y
# or
pnpm add @wajkie/a11y-core @wajkie/react-a11y
```

### Cannot find module '@wajkie/a11y-core/locales'

**Cause:** Your bundler doesn't support subpath exports or needs configuration.

**Solution for TypeScript:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler", // or "node16" or "nodenext"
    "resolvePackageJsonExports": true
  }
}
```

**Solution for Webpack 4:**
Webpack 4 doesn't support package.json exports. Upgrade to Webpack 5 or use full paths:
```ts
import { getMessages } from '@wajkie/a11y-core/dist/locales/index.js';
```

## TypeScript Issues

### Type errors: Property 'X' does not exist on type 'CustomLocales'

**Cause:** Using a custom locale without declaring it in TypeScript.

**Solution:**
```ts
// Create types/a11y.d.ts in your project
declare module '@wajkie/a11y-core/locales' {
  interface CustomLocales {
    de: 'de';
    fr: 'fr';
  }
}
```

### Cannot find type definitions

**Cause:** Package ships with types, but your IDE isn't detecting them.

**Solution:**
```bash
# Restart TypeScript server in VS Code
# Command Palette (Ctrl+Shift+P) → "TypeScript: Restart TS Server"

# Or check your tsconfig.json includes node_modules
{
  "compilerOptions": {
    "skipLibCheck": false
  }
}
```

## React Issues

### Hooks can only be called inside a function component

**Cause:** Using React hooks outside of components or calling them conditionally.

**Solution:**
```tsx
// ❌ Wrong
function MyComponent() {
  if (condition) {
    const ref = useFocusTrap(); // Conditional hook call
  }
}

// ✅ Correct
function MyComponent() {
  const ref = useFocusTrap(condition); // Pass condition to hook
}
```

### React version mismatch warnings

**Cause:** Multiple React versions installed or peer dependency issues.

**Solution:**
```bash
# Check for duplicate React installations
npm ls react

# If duplicates exist, dedupe
npm dedupe

# Or ensure only one React version
npm install react@^18.0.0 react-dom@^18.0.0
```

## Runtime Errors

### ReferenceError: window is not defined

**Cause:** Running in a Node.js/SSR environment without browser globals.

**Solution for Next.js:**
```tsx
import dynamic from 'next/dynamic';

// Disable SSR for components using browser APIs
const AccessibleComponent = dynamic(
  () => import('./AccessibleComponent'),
  { ssr: false }
);
```

**Solution for custom SSR:**
```tsx
import { useEffect, useState } from 'react';

function MyComponent() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  // Now safe to use browser APIs
  return <div>...</div>;
}
```

### ReferenceError: document is not defined

**Same as above** - the packages require browser DOM APIs. Use SSR guards.

### Cannot read property 'focus' of null

**Cause:** Ref not attached or element not mounted.

**Solution:**
```tsx
function MyComponent() {
  const ref = useFocusTrap();
  
  // ✅ Attach ref to a real DOM element
  return <div ref={ref}>Content</div>;
  
  // ❌ Don't use on non-DOM elements
  // return <Fragment ref={ref}>Content</Fragment>;
}
```

## Build/Bundle Issues

### Module parse failed: Unexpected token

**Cause:** Bundler doesn't understand modern JavaScript syntax.

**Solution for Webpack:**
```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: /node_modules\/@wajkie/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
```

**Solution for Vite:**
Vite handles this automatically. If issues persist:
```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@wajkie/a11y-core', '@wajkie/react-a11y']
  }
};
```

### Exports not found or undefined

**Cause:** Using CommonJS `require()` with ESM-only features.

**Solution:**
```js
// ❌ If your project is CJS
const { generateId } = require('@wajkie/a11y-core');

// ✅ Convert to ESM or use dynamic import
import('@wajkie/a11y-core').then(({ generateId }) => {
  // use generateId
});

// Or convert your package.json to ESM:
{
  "type": "module"
}
```

## Locale Issues

### Locale not loading or messages empty

**Cause:** Async import failed or locale not registered.

**Solution:**
```tsx
import { useA11yLocale } from '@wajkie/react-a11y';

function MyComponent() {
  const { locale, messages, isLoading } = useA11yLocale();
  
  // ✅ Always check loading state
  if (isLoading) return <div>Loading...</div>;
  
  // ✅ Now safe to use messages
  return <nav aria-label={messages.mainNavigation}>...</nav>;
}
```

### Custom locale not working

**Cause:** Forgot to register the locale before using it.

**Solution:**
```ts
import { registerLocale, setLocale } from '@wajkie/a11y-core/locales';

// ✅ Register first
registerLocale('de', {
  skipToContent: 'Zum Inhalt springen',
  mainNavigation: 'Hauptnavigation',
  // ... all other messages
});

// Then set locale
await setLocale('de');
```

## Performance Issues

### Bundle size too large

**Cause:** Importing entire package when only using specific features.

**Solution:**
The packages use tree-shaking. Ensure your bundler supports it:
```js
// vite.config.js or rollup.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'a11y': ['@wajkie/a11y-core', '@wajkie/react-a11y']
        }
      }
    }
  }
};
```

### Too many re-renders

**Cause:** Creating new function references in render.

**Solution:**
```tsx
// ❌ Creates new function on every render
function MyComponent() {
  const { handleKeyDown } = useKeyboardNavigation(
    5,
    (index) => console.log(index) // New function every render!
  );
}

// ✅ Use useCallback to memoize
function MyComponent() {
  const handleSelect = useCallback((index) => {
    console.log(index);
  }, []);
  
  const { handleKeyDown } = useKeyboardNavigation(5, handleSelect);
}
```

## Still Having Issues?

1. **Check Examples:** See [example/](../example) directory for working code
2. **Enable Debug Logging:** Open browser DevTools console for error messages
3. **Check Versions:**
   ```bash
   npm list @wajkie/a11y-core @wajkie/react-a11y react react-dom
   ```
4. **Create Minimal Reproduction:**
   - Use CodeSandbox or StackBlitz
   - Include only the failing code
   - Share the link when reporting issues

5. **Report Bugs:**
   - Include error messages (full stack trace)
   - Include environment (Node version, bundler, React version)
   - Include minimal code to reproduce
   - Check if issue exists in example app first
