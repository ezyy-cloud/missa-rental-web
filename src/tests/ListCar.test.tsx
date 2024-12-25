import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, mockUser, mockCar } from './utils';
import ListCarForm from '../components/forms/ListCarForm';
import { useAuthStore } from '../stores/authStore';
import { useCarStore } from '../stores/carStore';

// Mock the stores
vi.mock('../stores/authStore');
vi.mock('../stores/carStore');

describe('List Car Form', () => {
  beforeEach(() => {
    // Setup mock store states
    (useAuthStore as any).mockReturnValue({
      user: mockUser,
      initialized: true,
    });

    (useCarStore as any).mockReturnValue({
      createCar: vi.fn(),
      updateCar: vi.fn(),
    });
  });

  it('renders all required fields', () => {
    renderWithProviders(<ListCarForm />);
    
    expect(screen.getByLabelText('Car Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Price per Day')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Make')).toBeInTheDocument();
    expect(screen.getByLabelText('Model')).toBeInTheDocument();
    expect(screen.getByLabelText('Year')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProviders(<ListCarForm />);
    
    // Try to submit without filling required fields
    fireEvent.click(screen.getByText('List Car'));

    await waitFor(() => {
      expect(screen.getByText('Car name is required')).toBeInTheDocument();
      expect(screen.getByText('Price is required')).toBeInTheDocument();
      expect(screen.getByText('Location is required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const createCar = vi.fn().mockResolvedValue({ data: mockCar });
    (useCarStore as any).mockReturnValue({
      createCar,
    });

    renderWithProviders(<ListCarForm />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText('Car Name'), {
      target: { value: mockCar.name },
    });
    fireEvent.change(screen.getByLabelText('Price per Day'), {
      target: { value: mockCar.price },
    });
    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: mockCar.location },
    });
    fireEvent.change(screen.getByLabelText('Make'), {
      target: { value: mockCar.make },
    });
    fireEvent.change(screen.getByLabelText('Model'), {
      target: { value: mockCar.model },
    });
    fireEvent.change(screen.getByLabelText('Year'), {
      target: { value: mockCar.year },
    });

    // Submit form
    fireEvent.click(screen.getByText('List Car'));

    await waitFor(() => {
      expect(createCar).toHaveBeenCalledWith(expect.objectContaining({
        name: mockCar.name,
        price: mockCar.price,
        location: mockCar.location,
      }));
    });
  });

  it('handles image upload', async () => {
    renderWithProviders(<ListCarForm />);
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText('Upload Car Images');
    
    Object.defineProperty(input, 'files', {
      value: [file],
    });
    
    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText('test.png')).toBeInTheDocument();
    });
  });

  it('shows edit mode with existing car data', () => {
    renderWithProviders(<ListCarForm car={mockCar} />);
    
    expect(screen.getByLabelText('Car Name')).toHaveValue(mockCar.name);
    expect(screen.getByLabelText('Price per Day')).toHaveValue(mockCar.price.toString());
    expect(screen.getByLabelText('Location')).toHaveValue(mockCar.location);
    expect(screen.getByText('Update Car')).toBeInTheDocument();
  });
});
