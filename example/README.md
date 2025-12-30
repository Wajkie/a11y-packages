# @wajkie/a11y Packages - Example Project

This example project demonstrates all features of `@wajkie/a11y-core` and `@wajkie/react-a11y` packages.

## Running the Example

```bash
# From the root packages directory
npm install

# Build the packages first
npm run build

# Start the example
cd example
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What's Demonstrated

### 1. **Skip Navigation**
- Press Tab on page load to reveal the skip link
- Implements WCAG 2.4.1 (Bypass Blocks)

### 2. **Modal with Focus Management**
- `useFocusTrap` - Traps keyboard focus within modal
- `useFocusRestoration` - Returns focus after closing
- WCAG 2.4.3 (Focus Order)

### 3. **Keyboard Navigation**
- `useKeyboardNavigation` - Arrow keys, Home, End support
- Dropdown menu with full keyboard control
- WCAG 2.1.1 (Keyboard)

### 4. **Form Accessibility**
- `useAutoFocus` - Auto-focuses first input
- `useAnnouncer` - Announces form submission/errors
- Proper ARIA attributes and error handling
- WCAG 3.3.1 (Error Identification)

### 5. **Reduced Motion Detection**
- `useReducedMotion` - Respects user preferences
- WCAG 2.3.3 (Animation from Interactions)

### 6. **Internationalization**
- `useA11yLocale` - Switch between English/Swedish
- 36+ pre-translated UI strings
- All ARIA labels localized

### 7. **Building Custom Components**
- Complete code examples for custom accessible components
- Alert, Tabs, Combobox, Tooltip, Dialog patterns
- Best practices and implementation guidelines
- See the Documentation section in the app

## Testing Guide

### Keyboard Testing

1. **Tab Navigation**: Press Tab to move through all interactive elements
2. **Modal**: Open modal, verify focus is trapped, press Escape to close
3. **Dropdown**: Use ↑↓ arrows, Home, End to navigate menu items
4. **Forms**: Tab through form fields, verify focus indicators

### Screen Reader Testing

**Windows (NVDA):**
```bash
# Download NVDA from nvaccess.org
# Press Insert+Down Arrow to enter browse mode
# Use Tab to navigate, NVDA will read all ARIA labels
```

**macOS (VoiceOver):**
```bash
# Press Cmd+F5 to enable VoiceOver
# Use Tab to navigate, VoiceOver will read all ARIA labels
```

### Visual Testing

1. **Zoom**: Test at 200% zoom (Ctrl/Cmd + '+')
2. **Focus Indicators**: All interactive elements should have visible focus rings
3. **Color Contrast**: Text should be readable

### Reduced Motion

**Windows:**
Settings → Accessibility → Visual effects → Animation effects (toggle off)

**macOS:**
System Preferences → Accessibility → Display → Reduce motion (check)

## Package Structure

```
example/
├── src/
│   ├── main.tsx       # Entry point
│   ├── App.tsx        # Main app with all demos
│   └── App.css        # Accessible styles
├── index.html
├── package.json
└── vite.config.ts
```

## Features Showcased

| Feature | Hook/Component | Demo Section |
|---------|---------------|--------------|
| Skip Navigation | `<SkipNavigation>` | Header |
| Focus Trap | `useFocusTrap` | Modal |
| Focus Restoration | `useFocusRestoration` | Modal |
| Auto Focus | `useAutoFocus` | Form |
| Keyboard Nav | `useKeyboardNavigation` | Dropdown |
| Announcements | `useAnnouncer` | Form |
| Reduced Motion | `useReducedMotion` | Motion Demo |
| i18n | `useA11yLocale` | Language Switcher |

## Code Examples

The app includes complete, copy-paste-ready examples for:

### Ready-to-Use Components
- **Alert Component** - Accessible notifications with screen reader announcements
- **Tabs Component** - Keyboard-navigable tab interface (ARIA tablist pattern)
- **Combobox** - Autocomplete/search with live results announcements
- **Tooltip** - Keyboard and mouse accessible tooltips
- **Dialog** - Modal dialog with focus lock and escape handling

### Implementation Features
All demos include:
- ✅ Proper ARIA attributes
- ✅ Keyboard accessibility
- ✅ Screen reader support
- ✅ Focus management
- ✅ Error handling
- ✅ WCAG 2.1 AA compliance

Find all code examples in the Documentation section (#docs) of the running app.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Learn More

- [a11y-core README](../a11y-core/README.md)
- [react-a11y README](../react-a11y/README.md)
- [Contributing Guide](../CONTRIBUTING.md)
