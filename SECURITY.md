# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

- **Email**: security@wajkie.com (or your GitHub private vulnerability reporting)
- **GitHub**: Use [Private Vulnerability Reporting](https://github.com/wajkie/a11y-packages/security/advisories/new)

Please include the following information:

### Required Information

- **Package name and version** (`@wajkie/a11y-core` or `@wajkie/react-a11y`)
- **Description** of the vulnerability
- **Steps to reproduce** the issue
- **Potential impact** of the vulnerability
- **Suggested fix** (if you have one)

### What to Expect

1. **Acknowledgment**: We'll respond within 48 hours to acknowledge receipt
2. **Assessment**: We'll assess the vulnerability within 5 business days
3. **Updates**: We'll keep you informed of our progress
4. **Resolution**: We'll work on a fix and coordinate disclosure
5. **Credit**: We'll credit you in the security advisory (unless you prefer to remain anonymous)

## Security Considerations

### XSS Protection

Our packages handle user-generated content in several ways:

- `announceToScreenReader()` - Creates DOM elements with user text
- `createAriaLabel()` - Generates ARIA labels from strings
- Screen reader announcements

**Best Practices:**
- Always sanitize user input before passing to our functions
- Never use `dangerouslySetInnerHTML` with generated ARIA labels
- Validate and escape data from external sources

### Focus Management Security

- Focus trap mechanisms could be used for clickjacking if misused
- Always provide clear escape mechanisms (Escape key, close button)
- Never trap focus without user interaction

### Dependency Security

We have **zero runtime dependencies** for `@wajkie/a11y-core`:
- No third-party packages that could introduce vulnerabilities
- React and React-DOM are peer dependencies (managed by the consumer)

### CSP (Content Security Policy)

Our packages:
- Do not use `eval()` or `Function()` constructors
- Do not require `unsafe-inline` for scripts
- Create minimal DOM elements dynamically for ARIA live regions
- Are compatible with strict CSP policies

### Known Limitations

1. **Screen Reader Announcements**: Creates temporary DOM elements
   - Could potentially be abused for DOM-based XSS if input isn't sanitized
   - **Mitigation**: Always sanitize user input before announcing

2. **Focus Trap**: Queries DOM for focusable elements
   - Performance impact on very large DOMs
   - **Mitigation**: Limit to specific containers

3. **LocalStorage**: We don't use localStorage/sessionStorage
   - No data persistence vulnerabilities

## Security Best Practices for Users

### 1. Input Validation

```typescript
// ❌ Dangerous
const userInput = getUserInput();
announceToScreenReader(userInput);

// ✅ Safe
const userInput = getUserInput();
const sanitized = sanitizeHtml(userInput);
announceToScreenReader(sanitized);
```

### 2. ARIA Label Safety

```typescript
// ❌ Dangerous
const label = createAriaLabel(userGeneratedText);

// ✅ Safe
const sanitized = escapeHtml(userGeneratedText);
const label = createAriaLabel(sanitized);
```

### 3. Focus Trap Escapes

```typescript
// ✅ Always provide escape mechanisms
<Dialog onClose={handleClose} onEscapeKey={handleClose}>
  <button onClick={handleClose}>Close</button>
</Dialog>
```

## Vulnerability Disclosure Timeline

1. **Day 0**: Vulnerability reported
2. **Day 1-2**: Acknowledgment sent
3. **Day 3-7**: Assessment and validation
4. **Day 8-30**: Fix development and testing
5. **Day 31**: Coordinated disclosure (if applicable)
6. **Day 31+**: Public release of fix

## Security Updates

Security updates will be:
- Released as patch versions (e.g., 0.1.1 → 0.1.2)
- Documented in CHANGELOG.md
- Announced via GitHub Security Advisories
- Tagged with `security` label

## Responsible Disclosure

We practice responsible disclosure:
- We'll work with you to understand and fix the issue
- We'll credit you in the advisory (unless you prefer anonymity)
- We'll coordinate timing of public disclosure
- We ask for reasonable time to fix vulnerabilities before public disclosure

## Hall of Fame

We're grateful to security researchers who help keep our packages secure:

<!-- Names will be added here as vulnerabilities are responsibly disclosed -->

*No security vulnerabilities have been reported yet.*

## Questions?

For security questions that don't require confidentiality, you can:
- Open a [GitHub Discussion](https://github.com/wajkie/a11y-packages/discussions)
- Tag issues with the `security` label

Thank you for helping keep @wajkie/a11y packages secure! 🔒
