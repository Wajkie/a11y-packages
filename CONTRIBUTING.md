# Contributing to @wajkie/a11y packages

Thank you for your interest in contributing to the @wajkie accessibility packages! We welcome contributions from the community.

## Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm 9.x or higher
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/a11y-packages.git
   cd a11y-packages
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the packages:
   ```bash
   npm run build
   ```

5. Run tests:
   ```bash
   npm run test
   ```

## Development Workflow

### Working on a11y-core

```bash
cd a11y-core
npm run dev        # Watch mode for building
npm run test:watch # Watch mode for tests
```

### Working on react-a11y

```bash
cd react-a11y
npm run dev        # Watch mode for building
npm run test:watch # Watch mode for tests
```

### Testing Both Packages

```bash
# From root packages directory
npm run test          # Run all tests
npm run test:coverage # Run with coverage report
npm run lint          # Lint all packages
npm run format        # Format all files
```

## Making Changes

### Branch Naming

- Feature: `feature/description`
- Bug fix: `fix/description`
- Documentation: `docs/description`
- Performance: `perf/description`

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add new utility function`
- `fix: correct focus trap behavior`
- `docs: update README examples`
- `test: add tests for announcer hook`
- `refactor: simplify locale loading`
- `perf: optimize focus management`
- `chore: update dependencies`

### Code Style

- We use ESLint and Prettier (automatically enforced via pre-commit hooks)
- Run `npm run format` before committing
- Run `npm run lint:fix` to auto-fix linting issues

### Adding New Features

1. **Write tests first** (TDD approach preferred)
2. Implement the feature
3. Update documentation
4. Add JSDoc comments
5. Create a changeset (see below)

### Example: Adding a New Utility

```typescript
// 1. Add to src/index.ts
/**
 * Description of what it does
 * @param param - Description
 * @returns Description
 * 
 * @example
 * ```ts
 * // Usage example
 * ```
 */
export const myNewUtility = (param: string): string => {
  // Implementation
  return param;
};

// 2. Add tests in src/__tests__/index.test.ts
describe('myNewUtility', () => {
  it('should work correctly', () => {
    expect(myNewUtility('test')).toBe('test');
  });
});

// 3. Update README.md with usage examples
```

## Changesets

We use [Changesets](https://github.com/changesets/changesets) for version management.

### Creating a Changeset

After making changes:

```bash
npm run changeset
```

Follow the prompts:
1. Select which packages changed
2. Choose version bump type (major/minor/patch)
3. Write a summary of changes

This creates a file in `.changeset/` directory.

### Version Bump Guidelines

- **Major (breaking)**: API changes that break existing code
- **Minor (feature)**: New features, backward compatible
- **Patch (fix)**: Bug fixes, backward compatible

## Testing

### Running Tests

```bash
# All tests
npm run test

# With coverage
npm run test:coverage

# Watch mode (during development)
npm run test:watch
```

### Writing Tests

- Place tests in `src/__tests__/` directory
- Name test files: `*.test.ts` or `*.test.tsx`
- Aim for 80%+ code coverage
- Test edge cases and error conditions

### Test Structure

```typescript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments to all exported functions/classes
- Include `@param`, `@returns`, `@example` tags
- Explain **why**, not just **what**

### README Updates

When adding features:
1. Add to "Quick Start" if it's common usage
2. Add detailed section with examples
3. Link to related WCAG criteria
4. Update TypeScript types section if applicable

## Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** with tests
3. **Create a changeset** (`npm run changeset`)
4. **Run all checks**:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```
5. **Push your branch** and create a PR
6. **Fill out the PR template** completely
7. **Wait for review** and address feedback

### PR Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Changeset created
- [ ] All tests passing
- [ ] Linting passes
- [ ] No TypeScript errors
- [ ] Examples work correctly

## Code Review

### What We Look For

- **Correctness**: Does it work as intended?
- **Tests**: Are there comprehensive tests?
- **Documentation**: Is it well documented?
- **Accessibility**: Does it follow WCAG guidelines?
- **Performance**: Is it efficient?
- **Code Style**: Does it follow our conventions?

### Review Process

1. Automated checks must pass
2. At least one maintainer review required
3. Address all comments
4. Squash commits before merging (optional)

## Accessibility Standards

All contributions must:

- Follow **WCAG 2.1 Level AA** guidelines
- Include proper ARIA attributes
- Support keyboard navigation
- Work with screen readers
- Provide meaningful error messages

### Testing Accessibility

```bash
# Run example project
cd example
npm run dev

# Test with:
# - Keyboard only (Tab, Enter, Escape, Arrows)
# - Screen reader (NVDA on Windows, VoiceOver on Mac)
# - Browser DevTools Accessibility panel
```

## Project Structure

```
packages/
├── a11y-core/          # Core utilities
│   ├── src/
│   │   ├── index.ts
│   │   ├── locales/
│   │   └── __tests__/
│   └── package.json
├── react-a11y/         # React hooks & components
│   ├── src/
│   │   ├── index.ts
│   │   ├── hooks/
│   │   ├── components/
│   │   └── __tests__/
│   └── package.json
├── example/            # Demo project
└── package.json        # Root package (workspaces)
```

## Release Process

(For maintainers only)

1. Merge PRs with changesets to `main`
2. Changesets bot creates a "Release" PR
3. Review and merge the Release PR
4. Packages automatically published to npm
5. GitHub releases created automatically

## Getting Help

- 🐛 **Bug reports**: Open an issue
- 💡 **Feature requests**: Open a discussion
- ❓ **Questions**: Check existing issues/discussions
- 💬 **Chat**: Join our Discord (if applicable)

## Code of Conduct

Be respectful, inclusive, and professional. We don't tolerate harassment or discrimination of any kind.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to making the web more accessible! 🎉
