import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, mockUser, mockProfile } from './utils';
import Profile from '../pages/Profile';
import { useAuthStore } from '../stores/authStore';
import { useProfileStore } from '../stores/profileStore';

// Mock the stores
vi.mock('../stores/authStore');
vi.mock('../stores/profileStore');

describe('Profile Page', () => {
  beforeEach(() => {
    // Setup mock store states
    (useAuthStore as any).mockReturnValue({
      user: mockUser,
      initialized: true,
    });

    (useProfileStore as any).mockReturnValue({
      profile: mockProfile,
      fetchProfile: vi.fn(),
      updateProfile: vi.fn(),
    });
  });

  it('renders profile information correctly', () => {
    renderWithProviders(<Profile />);
    
    expect(screen.getByText(mockProfile.full_name!)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.email!)).toBeInTheDocument();
  });

  it('shows verification warning when not verified', () => {
    (useProfileStore as any).mockReturnValue({
      profile: { ...mockProfile, verification_status: 'pending' },
      fetchProfile: vi.fn(),
      updateProfile: vi.fn(),
    });

    renderWithProviders(<Profile />);
    
    expect(screen.getByText('Verification Required')).toBeInTheDocument();
  });

  it('allows editing profile information', async () => {
    const updateProfile = vi.fn();
    (useProfileStore as any).mockReturnValue({
      profile: mockProfile,
      fetchProfile: vi.fn(),
      updateProfile,
    });

    renderWithProviders(<Profile />);
    
    // Click edit button
    fireEvent.click(screen.getByText('Edit Profile'));

    // Update name
    const nameInput = screen.getByLabelText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    // Save changes
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(expect.objectContaining({
        full_name: 'New Name',
      }));
    });
  });

  it('shows appropriate tabs', () => {
    renderWithProviders(<Profile />);
    
    expect(screen.getByRole('tab', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Verification' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Payment' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Bookings' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Reviews' })).toBeInTheDocument();
  });

  it('redirects to signin when not authenticated', () => {
    (useAuthStore as any).mockReturnValue({
      user: null,
      initialized: true,
    });

    const { container } = renderWithProviders(<Profile />);
    expect(container).toBeEmptyDOMElement();
  });
});
