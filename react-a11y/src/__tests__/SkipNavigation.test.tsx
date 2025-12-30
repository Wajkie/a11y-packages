import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SkipNavigation } from '../components/SkipNavigation';

describe('SkipNavigation', () => {
  it('should render with default text', () => {
    render(<SkipNavigation />);
    const link = screen.getByText('Skip to main content');
    expect(link).toBeDefined();
  });

  it('should render with custom text', () => {
    render(<SkipNavigation>Hoppa till huvudinnehåll</SkipNavigation>);
    const link = screen.getByText('Hoppa till huvudinnehåll');
    expect(link).toBeDefined();
  });

  it('should have default href to #main-content', () => {
    render(<SkipNavigation />);
    const link = screen.getByText('Skip to main content');
    expect(link.getAttribute('href')).toBe('#main-content');
  });

  it('should accept custom href', () => {
    render(<SkipNavigation href="#content">Skip</SkipNavigation>);
    const link = screen.getByText('Skip');
    expect(link.getAttribute('href')).toBe('#content');
  });

  it('should render as an anchor element', () => {
    render(<SkipNavigation />);
    const link = screen.getByText('Skip to main content');
    expect(link.tagName).toBe('A');
  });

  it('should apply custom className', () => {
    render(<SkipNavigation className="custom-class">Skip</SkipNavigation>);
    const link = screen.getByText('Skip');
    expect(link.className).toBe('custom-class');
  });

  it('should apply default className when not provided', () => {
    render(<SkipNavigation />);
    const link = screen.getByText('Skip to main content');
    expect(link.className).toContain('sr-only');
    expect(link.className).toContain('focus:not-sr-only');
  });
});
