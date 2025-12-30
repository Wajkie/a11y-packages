# @wajkie Accessibility Packages

A collection of accessibility utilities and React hooks for building WCAG 2.1 AA compliant web applications, developed as part of my graduation project.

[![CI](https://github.com/wajkie/a11y-packages/workflows/CI/badge.svg)](https://github.com/wajkie/a11y-packages/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 📦 Packages

### [@wajkie/a11y-core](./a11y-core)
[![npm version](https://img.shields.io/npm/v/@wajkie/a11y-core.svg)](https://www.npmjs.com/package/@wajkie/a11y-core)

Framework-agnostic accessibility utilities. Works with any JavaScript framework or vanilla JS.

```bash
npm install @wajkie/a11y-core
```

**Features:**
- 🎯 Focus management (trap, restore)
- 📢 Screen reader announcements
- 🏷️ ARIA helper functions
- 🌍 i18n support (English, Swedish)
- 📦 Tree-shakeable
- 💪 TypeScript support

### [@wajkie/react-a11y](./react-a11y)
[![npm version](https://img.shields.io/npm/v/@wajkie/react-a11y.svg)](https://www.npmjs.com/package/@wajkie/react-a11y)

React hooks and components for accessibility.

```bash
npm install @wajkie/react-a11y
```

**Features:**
- 🎣 7 custom hooks
- 🧩 Ready-to-use components
- ⚛️ React 18 & 19 compatible
- 🌍 Internationalization
- 📦 Tree-shakeable
- 💪 TypeScript support

## 🚀 Quick Start

```tsx
import { SkipNavigation, useFocusTrap, useAnnouncer } from '@wajkie/react-a11y';

function App() {
  const announce = useAnnouncer();
  
  return (
    <>
      <SkipNavigation />
      <main id="main-content">
        <button onClick={() => announce('Hello!', 'polite')}>
          Click me
        </button>
      </main>
    </>
  );
}
```

## 📚 Documentation

- [a11y-core Documentation](./a11y-core/README.md)
- [react-a11y Documentation](./react-a11y/README.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Example Project](./example)

## ✨ Demo

```bash
# Clone the repository
git clone https://github.com/wajkie/a11y-packages.git
cd a11y-packages

# Install dependencies
npm install

# Build packages
npm run build

# Run example project
cd example
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see all features in action!

## ♿ WCAG 2.1 AA Compliance

These packages help you meet the following success criteria:

| Criterion | Level | Coverage |
|-----------|-------|----------|
| 1.3.1 Info and Relationships | A | ✅ ARIA helpers |
| 2.1.1 Keyboard | A | ✅ Focus management |
| 2.1.2 No Keyboard Trap | A | ✅ Focus trap with escape |
| 2.4.1 Bypass Blocks | A | ✅ Skip navigation |
| 2.4.3 Focus Order | A | ✅ Focus trap |
| 2.4.7 Focus Visible | AA | ✅ Focus utilities |
| 2.3.3 Animation | AAA | ✅ Reduced motion |
| 3.3.1 Error Identification | A | ✅ Form ARIA |
| 3.3.2 Labels or Instructions | A | ✅ ARIA labels |
| 4.1.2 Name, Role, Value | A | ✅ ARIA attributes |
| 4.1.3 Status Messages | AA | ✅ Announcer |

## 🧪 Testing

```bash
# Run all tests
npm run test
# a11y-core: 61/61 passing ✅
# react-a11y: 23/39 passing (16 integration tests pending)

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Format code
npm run format
```

## 📦 Monorepo Structure

This is a monorepo containing multiple packages:

```
(repository root)
├── a11y-core/          # Core utilities (framework-agnostic)
├── react-a11y/         # React hooks & components
├── example/            # Demo application
├── .changeset/         # Version management
├── .github/            # CI/CD workflows
├── .husky/             # Git hooks
├── package.json        # Workspace configuration
└── README.md           # This file
```

## 🔄 Version Management

We use [Changesets](https://github.com/changesets/changesets) for version management:

```bash
# Create a changeset
npm run changeset

# Version packages
npm run version

# Publish to npm
npm run release
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) before submitting PRs.

### Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Create a branch: `git checkout -b feature/my-feature`
4. Make your changes with tests
5. Create a changeset: `npm run changeset`
6. Push and create a PR

## 📄 License

MIT © Wajkie

## 🔗 Links

- [npm: @wajkie/a11y-core](https://www.npmjs.com/package/@wajkie/a11y-core)
- [npm: @wajkie/react-a11y](https://www.npmjs.com/package/@wajkie/react-a11y)
- [GitHub Repository](https://github.com/wajkie/a11y-packages)
- [Issue Tracker](https://github.com/wajkie/a11y-packages/issues)

## 📊 Package Stats

- **Bundle Size**: < 5KB gzipped (both packages combined)
- **TypeScript**: 100% typed
- **Test Coverage**: > 80%
- **Zero Dependencies**: (except React for react-a11y)
- **Tree-shakeable**: Only bundle what you use

## 🌟 Features Comparison

| Feature | a11y-core | react-a11y |
|---------|-----------|------------|
| Focus Management | ✅ | ✅ (hooks) |
| Screen Reader Support | ✅ | ✅ |
| ARIA Helpers | ✅ | ✅ |
| i18n | ✅ | ✅ |
| Components | ❌ | ✅ |
| Framework | Any | React only |

## 🎓 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)

---

**Built by Wajkie during my Frontend Developer education**
