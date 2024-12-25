import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../utils';
import App from '../../App';
import { useAuthStore } from '../../stores/authStore';

describe('Mobile Responsiveness', () => {
  beforeEach(() => {
    // Reset viewport
    window.innerWidth = 1024;
    window.innerHeight = 768;
    window.dispatchEvent(new Event('resize'));
  });

  const setMobileViewport = () => {
    window.innerWidth = 375;
    window.innerHeight = 667;
    window.dispatchEvent(new Event('resize'));
  };

  const setTabletViewport = () => {
    window.innerWidth = 768;
    window.innerHeight = 1024;
    window.dispatchEvent(new Event('resize'));
  };

  it('shows mobile menu on small screens', () => {
    setMobileViewport();
    renderWithProviders(<App />);

    // Menu should be hidden initially
    expect(screen.queryByRole('navigation')).not.toBeVisible();

    // Click hamburger menu
    fireEvent.click(screen.getByLabelText('Open menu'));

    // Menu should be visible
    expect(screen.getByRole('navigation')).toBeVisible();
  });

  it('adjusts car grid layout for different screen sizes', () => {
    const { container, rerender } = renderWithProviders(<App />);

    // Desktop: 3 columns
    let grid = container.querySelector('.car-grid');
    expect(grid).toHaveClass('grid-cols-3');

    // Tablet: 2 columns
    setTabletViewport();
    rerender(<App />);
    expect(grid).toHaveClass('grid-cols-2');

    // Mobile: 1 column
    setMobileViewport();
    rerender(<App />);
    expect(grid).toHaveClass('grid-cols-1');
  });

  it('adapts forms for mobile screens', () => {
    setMobileViewport();
    renderWithProviders(<App />);

    const form = screen.getByTestId('search-form');
    expect(form).toHaveClass('flex-col');
    
    // Fields should stack vertically
    const fields = form.querySelectorAll('.form-field');
    fields.forEach(field => {
      expect(field).toHaveClass('w-full');
    });
  });

  it('shows appropriate image sizes for different screens', () => {
    const { container, rerender } = renderWithProviders(<App />);

    // Desktop: large images
    let carImage = container.querySelector('.car-image');
    expect(carImage).toHaveAttribute('srcset', expect.stringContaining('large.jpg'));

    // Tablet: medium images
    setTabletViewport();
    rerender(<App />);
    expect(carImage).toHaveAttribute('srcset', expect.stringContaining('medium.jpg'));

    // Mobile: small images
    setMobileViewport();
    rerender(<App />);
    expect(carImage).toHaveAttribute('srcset', expect.stringContaining('small.jpg'));
  });

  it('adjusts navigation for mobile', () => {
    setMobileViewport();
    renderWithProviders(<App />);

    // Bottom navigation should be visible on mobile
    const bottomNav = screen.getByTestId('bottom-nav');
    expect(bottomNav).toBeVisible();
    expect(bottomNav).toHaveClass('fixed bottom-0');

    // Should have compact icons
    const navItems = bottomNav.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      expect(item).toHaveClass('text-xs');
      expect(item.querySelector('svg')).toHaveClass('w-5 h-5');
    });
  });

  it('handles touch interactions properly', () => {
    setMobileViewport();
    renderWithProviders(<App />);

    const carousel = screen.getByTestId('car-carousel');
    
    // Simulate swipe
    fireEvent.touchStart(carousel, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchMove(carousel, { touches: [{ clientX: -100, clientY: 0 }] });
    fireEvent.touchEnd(carousel);

    // Should move to next slide
    expect(carousel).toHaveAttribute('data-active-slide', '1');
  });

  it('maintains tap target sizes on mobile', () => {
    setMobileViewport();
    renderWithProviders(<App />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      const styles = window.getComputedStyle(button);
      const height = parseFloat(styles.height);
      expect(height).toBeGreaterThanOrEqual(44); // Minimum tap target size
    });
  });
});
