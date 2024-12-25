import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, mockUser, mockCar } from '../utils';
import CarDetails from '../../pages/CarDetails';
import { useAuthStore } from '../../stores/authStore';
import { useCarStore } from '../../stores/carStore';
import { useBookingStore } from '../../stores/bookingStore';

describe('Car Booking Flow', () => {
  beforeEach(() => {
    // Mock authenticated user
    (useAuthStore as any).mockReturnValue({
      user: mockUser,
      initialized: true,
    });

    // Mock car data
    (useCarStore as any).mockReturnValue({
      car: mockCar,
      fetchCar: vi.fn(),
    });

    // Mock booking functions
    (useBookingStore as any).mockReturnValue({
      createBooking: vi.fn(),
      checkAvailability: vi.fn().mockResolvedValue(true),
    });
  });

  it('completes a successful booking flow', async () => {
    const createBooking = vi.fn().mockResolvedValue({ success: true });
    (useBookingStore as any).mockReturnValue({
      createBooking,
      checkAvailability: vi.fn().mockResolvedValue(true),
    });

    renderWithProviders(<CarDetails carId={mockCar.id} />);

    // Check car details are displayed
    expect(screen.getByText(mockCar.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockCar.price}/day`)).toBeInTheDocument();

    // Select dates
    const startDate = screen.getByLabelText('Start Date');
    const endDate = screen.getByLabelText('End Date');
    
    fireEvent.change(startDate, { target: { value: '2024-12-26' } });
    fireEvent.change(endDate, { target: { value: '2024-12-28' } });

    // Click book now
    fireEvent.click(screen.getByText('Book Now'));

    // Verify booking details
    expect(screen.getByText('Booking Summary')).toBeInTheDocument();
    expect(screen.getByText('Total: $300')).toBeInTheDocument();

    // Confirm booking
    fireEvent.click(screen.getByText('Confirm Booking'));

    await waitFor(() => {
      expect(createBooking).toHaveBeenCalledWith({
        car_id: mockCar.id,
        start_date: '2024-12-26',
        end_date: '2024-12-28',
        total_price: 300,
      });
    });

    // Check success message
    expect(screen.getByText('Booking Successful!')).toBeInTheDocument();
  });

  it('handles unavailable dates', async () => {
    (useBookingStore as any).mockReturnValue({
      checkAvailability: vi.fn().mockResolvedValue(false),
    });

    renderWithProviders(<CarDetails carId={mockCar.id} />);

    // Select unavailable dates
    const startDate = screen.getByLabelText('Start Date');
    const endDate = screen.getByLabelText('End Date');
    
    fireEvent.change(startDate, { target: { value: '2024-12-26' } });
    fireEvent.change(endDate, { target: { value: '2024-12-28' } });

    await waitFor(() => {
      expect(screen.getByText('Selected dates are not available')).toBeInTheDocument();
    });

    // Book now button should be disabled
    expect(screen.getByText('Book Now')).toBeDisabled();
  });

  it('requires authentication for booking', () => {
    (useAuthStore as any).mockReturnValue({
      user: null,
      initialized: true,
    });

    renderWithProviders(<CarDetails carId={mockCar.id} />);

    // Should show login prompt
    expect(screen.getByText('Please log in to book this car')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('requires verified identity for booking', () => {
    (useAuthStore as any).mockReturnValue({
      user: mockUser,
      profile: { ...mockUser, verification_status: 'pending' },
      initialized: true,
    });

    renderWithProviders(<CarDetails carId={mockCar.id} />);

    // Should show verification prompt
    expect(screen.getByText('Please verify your identity to book cars')).toBeInTheDocument();
    expect(screen.getByText('Verify Identity')).toBeInTheDocument();
  });
});
