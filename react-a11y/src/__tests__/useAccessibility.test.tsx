/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useFocusTrap,
  useFocusRestoration,
  useAutoFocus,
  useReducedMotion,
  useKeyboardNavigation,
  useAnnouncer,
} from '../hooks/useAccessibility';

describe('useFocusTrap', () => {
  it('should return a ref', () => {
    const { result } = renderHook(() => useFocusTrap(true));
    expect(result.current).toHaveProperty('current');
  });

  it('should not activate trap when isActive is false', () => {
    const { result } = renderHook(() => useFocusTrap(false));
    expect(result.current.current).toBe(null);
  });
});

describe('useFocusRestoration', () => {
  it('should provide saveFocus and restoreFocus functions', () => {
    const { result } = renderHook(() => useFocusRestoration());

    expect(typeof result.current.saveFocus).toBe('function');
    expect(typeof result.current.restoreFocus).toBe('function');
  });

  it('should not throw when calling functions', () => {
    const { result } = renderHook(() => useFocusRestoration());

    expect(() => {
      act(() => {
        result.current.saveFocus();
        result.current.restoreFocus();
      });
    }).not.toThrow();
  });

  it('should maintain stable function references', () => {
    const { result, rerender } = renderHook(() => useFocusRestoration());

    const saveFocusRef = result.current.saveFocus;
    const restoreFocusRef = result.current.restoreFocus;

    rerender();

    expect(result.current.saveFocus).toBe(saveFocusRef);
    expect(result.current.restoreFocus).toBe(restoreFocusRef);
  });
});

describe('useAutoFocus', () => {
  it('should return a ref', () => {
    const { result } = renderHook(() => useAutoFocus());
    expect(result.current).toHaveProperty('current');
  });
});

describe('useReducedMotion', () => {
  it('should return a boolean', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(typeof result.current).toBe('boolean');
  });

  it('should return false by default in test environment', () => {
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('should return true when user prefers reduced motion', () => {
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('should set up and clean up event listener', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    const matchMediaMock = vi.fn().mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    const { unmount } = renderHook(() => useReducedMotion());

    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});

describe('useKeyboardNavigation', () => {
  it('should return handleKeyDown function and currentIndex', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useKeyboardNavigation(5, onSelect));

    expect(typeof result.current.handleKeyDown).toBe('function');
    expect(typeof result.current.currentIndex).toBe('number');
  });

  it('should start with index 0', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useKeyboardNavigation(5, onSelect));

    expect(result.current.currentIndex).toBe(0);
  });

  it('should call onSelect with next index on ArrowDown', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useKeyboardNavigation(5, onSelect));

    const event = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
    } as any;

    act(() => {
      result.current.handleKeyDown(event);
    });

    expect(onSelect).toHaveBeenCalledWith(1);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should call onSelect with previous index on ArrowUp', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useKeyboardNavigation(5, onSelect, { loop: false }));

    // First move to index 1
    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as any);
    });

    onSelect.mockClear();

    // Then move back to index 0
    const event = {
      key: 'ArrowUp',
      preventDefault: vi.fn(),
    } as any;

    act(() => {
      result.current.handleKeyDown(event);
    });

    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it('should jump to first item on Home key', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useKeyboardNavigation(5, onSelect));

    // Move to index 3 first
    act(() => {
      result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: vi.fn() } as any);
      result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: vi.fn() } as any);
      result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: vi.fn() } as any);
    });

    onSelect.mockClear();

    const event = {
      key: 'Home',
      preventDefault: vi.fn(),
    } as any;

    act(() => {
      result.current.handleKeyDown(event);
    });

    expect(onSelect).toHaveBeenCalledWith(0);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should jump to last item on End key', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useKeyboardNavigation(5, onSelect));

    const event = {
      key: 'End',
      preventDefault: vi.fn(),
    } as any;

    act(() => {
      result.current.handleKeyDown(event);
    });

    expect(onSelect).toHaveBeenCalledWith(4);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should loop from last to first when loop is true', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useKeyboardNavigation(3, onSelect, { loop: true }));

    // Move to last item
    act(() => {
      result.current.handleKeyDown({ key: 'End', preventDefault: vi.fn() } as any);
    });

    onSelect.mockClear();

    // Press ArrowDown to loop to first
    const event = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
    } as any;

    act(() => {
      result.current.handleKeyDown(event);
    });

    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it('should not go beyond last item when loop is false', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() => useKeyboardNavigation(3, onSelect, { loop: false }));

    // Move to last item
    act(() => {
      result.current.handleKeyDown({ key: 'End', preventDefault: vi.fn() } as any);
    });

    onSelect.mockClear();

    // Try to go beyond
    const event = {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
    } as any;

    act(() => {
      result.current.handleKeyDown(event);
    });

    expect(onSelect).toHaveBeenCalledWith(2); // Stays at last index
  });

  it('should handle horizontal orientation with ArrowRight/ArrowLeft', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useKeyboardNavigation(5, onSelect, { orientation: 'horizontal' })
    );

    const rightEvent = {
      key: 'ArrowRight',
      preventDefault: vi.fn(),
    } as any;

    act(() => {
      result.current.handleKeyDown(rightEvent);
    });

    expect(onSelect).toHaveBeenCalledWith(1);
    expect(rightEvent.preventDefault).toHaveBeenCalled();

    onSelect.mockClear();

    const leftEvent = {
      key: 'ArrowLeft',
      preventDefault: vi.fn(),
    } as any;

    act(() => {
      result.current.handleKeyDown(leftEvent);
    });

    expect(onSelect).toHaveBeenCalledWith(0);
  });
});

describe('useAnnouncer', () => {
  it('should return a function', () => {
    const { result } = renderHook(() => useAnnouncer());
    expect(typeof result.current).toBe('function');
  });

  it('should create an announcement element when called', () => {
    const { result } = renderHook(() => useAnnouncer());

    act(() => {
      result.current('Test announcement');
    });

    const announcement = document.querySelector('[role="status"]');
    expect(announcement).toBeTruthy();
    expect(announcement?.textContent).toBe('Test announcement');
  });

  it('should set correct aria-live priority', () => {
    const { result } = renderHook(() => useAnnouncer());

    // Clear any previous announcements
    document.querySelectorAll('[role="status"]').forEach((el) => el.remove());

    act(() => {
      result.current('Important message', 'assertive');
    });

    const announcement = document.querySelector('[role="status"]');
    expect(announcement?.getAttribute('aria-live')).toBe('assertive');
  });

  it('should default to polite priority', () => {
    const { result } = renderHook(() => useAnnouncer());

    // Clear any previous announcements
    document.querySelectorAll('[role="status"]').forEach((el) => el.remove());

    act(() => {
      result.current('Test message');
    });

    const announcement = document.querySelector('[role="status"]');
    expect(announcement?.getAttribute('aria-live')).toBe('polite');
  });

  it('should maintain stable function reference', () => {
    const { result, rerender } = renderHook(() => useAnnouncer());

    const announceRef = result.current;
    rerender();

    expect(result.current).toBe(announceRef);
  });
});
