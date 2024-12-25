import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, mockUser } from '../utils';
import ListCar from '../../pages/ListCar';
import { useAuthStore } from '../../stores/authStore';
import { useCarStore } from '../../stores/carStore';

describe('Car Listing Flow', () => {
  beforeEach(() => {
    // Mock authenticated user
    (useAuthStore as any).mockReturnValue({
      user: mockUser,
      profile: { ...mockUser, verification_status: 'verified' },
      initialized: true,
    });

    // Mock car store
    (useCarStore as any).mockReturnValue({
      createCar: vi.fn(),
      uploadImages: vi.fn(),
    });
  });

  it('completes a successful car listing flow', async () => {
    const createCar = vi.fn().mockResolvedValue({ success: true });
    const uploadImages = vi.fn().mockResolvedValue(['image1.jpg', 'image2.jpg']);
    
    (useCarStore as any).mockReturnValue({
      createCar,
      uploadImages,
    });

    renderWithProviders(<ListCar />);

    // Fill in car details
    fireEvent.change(screen.getByLabelText('Car Name'), {
      target: { value: 'Tesla Model 3' },
    });
    
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Electric vehicle in excellent condition' },
    });
    
    fireEvent.change(screen.getByLabelText('Price per Day'), {
      target: { value: '100' },
    });
    
    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: 'San Francisco, CA' },
    });

    // Upload images
    const files = [
      new File(['image1'], 'car1.jpg', { type: 'image/jpeg' }),
      new File(['image2'], 'car2.jpg', { type: 'image/jpeg' }),
    ];

    const input = screen.getByLabelText('Upload Car Images');
    Object.defineProperty(input, 'files', { value: files });
    fireEvent.change(input);

    // Submit form
    fireEvent.click(screen.getByText('List Car'));

    await waitFor(() => {
      expect(uploadImages).toHaveBeenCalledWith(files);
      expect(createCar).toHaveBeenCalledWith({
        name: 'Tesla Model 3',
        description: 'Electric vehicle in excellent condition',
        price: 100,
        location: 'San Francisco, CA',
        images: ['image1.jpg', 'image2.jpg'],
      });
    });

    // Check success message
    expect(screen.getByText('Car listed successfully!')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProviders(<ListCar />);

    // Try to submit without filling required fields
    fireEvent.click(screen.getByText('List Car'));

    await waitFor(() => {
      expect(screen.getByText('Car name is required')).toBeInTheDocument();
      expect(screen.getByText('Price is required')).toBeInTheDocument();
      expect(screen.getByText('Location is required')).toBeInTheDocument();
    });
  });

  it('requires verified identity for listing', () => {
    (useAuthStore as any).mockReturnValue({
      user: mockUser,
      profile: { ...mockUser, verification_status: 'pending' },
      initialized: true,
    });

    renderWithProviders(<ListCar />);

    expect(screen.getByText('Please verify your identity to list cars')).toBeInTheDocument();
    expect(screen.getByText('Verify Identity')).toBeInTheDocument();
  });

  it('handles image upload errors', async () => {
    const uploadImages = vi.fn().mockRejectedValue(new Error('Upload failed'));
    
    (useCarStore as any).mockReturnValue({
      createCar: vi.fn(),
      uploadImages,
    });

    renderWithProviders(<ListCar />);

    // Try to upload invalid file
    const file = new File(['invalid'], 'invalid.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload Car Images');
    
    Object.defineProperty(input, 'files', { value: [file] });
    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText('Only image files are allowed')).toBeInTheDocument();
    });
  });

  it('shows preview of uploaded images', async () => {
    renderWithProviders(<ListCar />);

    const files = [
      new File(['image1'], 'car1.jpg', { type: 'image/jpeg' }),
      new File(['image2'], 'car2.jpg', { type: 'image/jpeg' }),
    ];

    const input = screen.getByLabelText('Upload Car Images');
    Object.defineProperty(input, 'files', { value: files });
    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByAltText('car1.jpg')).toBeInTheDocument();
      expect(screen.getByAltText('car2.jpg')).toBeInTheDocument();
    });
  });
});
