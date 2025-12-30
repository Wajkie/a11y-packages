"use client";

import React from 'react';

/**
 * Skip navigation link for keyboard users
 * WCAG 2.1 Success Criterion 2.4.1 (Level A) - Bypass Blocks
 * 
 * Provides a mechanism for keyboard users to skip repetitive navigation
 * and jump directly to the main content area.
 * 
 * @param props.children - Custom text for the skip link (optional)
 * @param props.href - Target element ID (default: "#main-content")
 * @param props.className - Additional CSS classes (optional)
 * 
 * @example
 * ```tsx
 * // Basic usage (English)
 * <SkipNavigation />
 * 
 * // Custom text (Swedish)
 * <SkipNavigation>Hoppa till huvudinnehåll</SkipNavigation>
 * 
 * // Custom target
 * <SkipNavigation href="#content">Skip to content</SkipNavigation>
 * 
 * // With custom styling
 * <SkipNavigation className="custom-skip-link">
 *   Skip to main content
 * </SkipNavigation>
 * ```
 * 
 * @remarks
 * This component should be placed as the first focusable element on the page.
 * The target element should have the corresponding ID and ideally a tabindex="-1"
 * to receive programmatic focus.
 */
export interface SkipNavigationProps {
  children?: React.ReactNode;
  href?: string;
  className?: string;
}

export function SkipNavigation({ 
  children = "Skip to main content", 
  href = "#main-content",
  className = "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
}: SkipNavigationProps) {
  return (
    <a
      href={href}
      className={className}
    >
      {children}
    </a>
  );
}
