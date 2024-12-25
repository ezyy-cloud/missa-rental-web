import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils';
import App from '../../App';

describe('Performance Tests', () => {
  beforeEach(() => {
    // Reset performance marks
    performance.clearMarks();
    performance.clearMeasures();
  });

  it('loads initial page within performance budget', async () => {
    performance.mark('start-render');
    
    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('app-content')).toBeInTheDocument();
    });

    performance.mark('end-render');
    performance.measure('initial-render', 'start-render', 'end-render');

    const measure = performance.getEntriesByName('initial-render')[0];
    expect(measure.duration).toBeLessThan(1000); // 1 second budget
  });

  it('lazy loads components efficiently', async () => {
    renderWithProviders(<App />);

    // Navigate to profile page which should be lazy loaded
    performance.mark('start-navigation');
    fireEvent.click(screen.getByText('Profile'));
    
    await waitFor(() => {
      expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    });

    performance.mark('end-navigation');
    performance.measure('navigation-time', 'start-navigation', 'end-navigation');

    const measure = performance.getEntriesByName('navigation-time')[0];
    expect(measure.duration).toBeLessThan(500); // 500ms budget
  });

  it('handles image loading efficiently', async () => {
    renderWithProviders(<App />);

    const images = screen.getAllByRole('img');
    
    // Check if images have loading="lazy"
    images.forEach(img => {
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    // Check if images have srcset for responsive loading
    const carImages = screen.getAllByTestId('car-image');
    carImages.forEach(img => {
      expect(img).toHaveAttribute('srcset');
    });
  });

  it('maintains smooth scrolling performance', async () => {
    renderWithProviders(<App />);

    const content = screen.getByTestId('scrollable-content');
    
    performance.mark('start-scroll');
    
    // Simulate rapid scrolling
    for (let i = 0; i < 100; i++) {
      fireEvent.scroll(content, { target: { scrollTop: i * 10 } });
    }

    performance.mark('end-scroll');
    performance.measure('scroll-performance', 'start-scroll', 'end-scroll');

    const measure = performance.getEntriesByName('scroll-performance')[0];
    expect(measure.duration).toBeLessThan(100); // 100ms budget
  });

  it('optimizes list rendering', async () => {
    renderWithProviders(<App />);

    performance.mark('start-list-render');
    
    // Render large list of cars
    const carList = screen.getByTestId('car-list');
    expect(carList.children.length).toBeGreaterThan(0);

    performance.mark('end-list-render');
    performance.measure('list-render', 'start-list-render', 'end-list-render');

    const measure = performance.getEntriesByName('list-render')[0];
    expect(measure.duration).toBeLessThan(200); // 200ms budget
  });

  it('caches API responses appropriately', async () => {
    renderWithProviders(<App />);

    // First load
    performance.mark('start-first-load');
    await waitFor(() => {
      expect(screen.getByTestId('car-grid')).toBeInTheDocument();
    });
    performance.mark('end-first-load');
    performance.measure('first-load', 'start-first-load', 'end-first-load');

    // Second load (should be cached)
    performance.mark('start-second-load');
    fireEvent.click(screen.getByText('Refresh'));
    await waitFor(() => {
      expect(screen.getByTestId('car-grid')).toBeInTheDocument();
    });
    performance.mark('end-second-load');
    performance.measure('second-load', 'start-second-load', 'end-second-load');

    const firstLoad = performance.getEntriesByName('first-load')[0];
    const secondLoad = performance.getEntriesByName('second-load')[0];
    expect(secondLoad.duration).toBeLessThan(firstLoad.duration);
  });
});
