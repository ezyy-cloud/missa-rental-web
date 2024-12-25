import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, mockUser } from '../utils';
import IdentityVerification from '../../components/profile/IdentityVerification';
import { useAuthStore } from '../../stores/authStore';
import { useProfileStore } from '../../stores/profileStore';

describe('Identity Verification Flow', () => {
  beforeEach(() => {
    // Mock authenticated user
    (useAuthStore as any).mockReturnValue({
      user: mockUser,
      initialized: true,
    });

    // Mock profile store
    (useProfileStore as any).mockReturnValue({
      profile: { ...mockUser, verification_status: 'pending' },
      updateProfile: vi.fn(),
      uploadDocument: vi.fn(),
    });
  });

  it('completes a successful verification flow', async () => {
    const updateProfile = vi.fn().mockResolvedValue({ success: true });
    const uploadDocument = vi.fn().mockResolvedValue('document1.jpg');
    
    (useProfileStore as any).mockReturnValue({
      profile: { ...mockUser, verification_status: 'pending' },
      updateProfile,
      uploadDocument,
    });

    renderWithProviders(<IdentityVerification />);

    // Step 1: Personal Information
    fireEvent.change(screen.getByLabelText('Full Legal Name'), {
      target: { value: 'John Doe' },
    });
    
    fireEvent.change(screen.getByLabelText('Date of Birth'), {
      target: { value: '1990-01-01' },
    });

    fireEvent.click(screen.getByText('Next'));

    // Step 2: ID Document
    const idFile = new File(['id'], 'id.jpg', { type: 'image/jpeg' });
    const idInput = screen.getByLabelText('Upload ID Document');
    Object.defineProperty(idInput, 'files', { value: [idFile] });
    fireEvent.change(idInput);

    fireEvent.change(screen.getByLabelText('ID Number'), {
      target: { value: 'AB123456' },
    });

    fireEvent.click(screen.getByText('Next'));

    // Step 3: Selfie
    const selfieFile = new File(['selfie'], 'selfie.jpg', { type: 'image/jpeg' });
    const selfieInput = screen.getByLabelText('Take Selfie');
    Object.defineProperty(selfieInput, 'files', { value: [selfieFile] });
    fireEvent.change(selfieInput);

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(uploadDocument).toHaveBeenCalledWith('id', idFile);
      expect(uploadDocument).toHaveBeenCalledWith('selfie', selfieFile);
      expect(updateProfile).toHaveBeenCalledWith({
        full_name: 'John Doe',
        date_of_birth: '1990-01-01',
        id_number: 'AB123456',
        verification_status: 'pending',
        id_document_url: 'document1.jpg',
        selfie_url: 'document1.jpg',
      });
    });

    // Check success message
    expect(screen.getByText('Verification submitted successfully!')).toBeInTheDocument();
  });

  it('validates required fields in each step', async () => {
    renderWithProviders(<IdentityVerification />);

    // Try to proceed without filling required fields
    fireEvent.click(screen.getByText('Next'));

    expect(screen.getByText('Full name is required')).toBeInTheDocument();
    expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
  });

  it('handles document upload errors', async () => {
    const uploadDocument = vi.fn().mockRejectedValue(new Error('Upload failed'));
    
    (useProfileStore as any).mockReturnValue({
      profile: { ...mockUser, verification_status: 'pending' },
      updateProfile: vi.fn(),
      uploadDocument,
    });

    renderWithProviders(<IdentityVerification />);

    // Try to upload invalid file
    const file = new File(['invalid'], 'invalid.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload ID Document');
    
    Object.defineProperty(input, 'files', { value: [file] });
    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText('Only image files are allowed')).toBeInTheDocument();
    });
  });

  it('shows verification status', () => {
    (useProfileStore as any).mockReturnValue({
      profile: { ...mockUser, verification_status: 'verified' },
      updateProfile: vi.fn(),
      uploadDocument: vi.fn(),
    });

    renderWithProviders(<IdentityVerification />);

    expect(screen.getByText('Verification Status: Verified')).toBeInTheDocument();
  });

  it('handles rejection status', () => {
    (useProfileStore as any).mockReturnValue({
      profile: {
        ...mockUser,
        verification_status: 'rejected',
        rejection_reason: 'Documents unclear',
      },
      updateProfile: vi.fn(),
      uploadDocument: vi.fn(),
    });

    renderWithProviders(<IdentityVerification />);

    expect(screen.getByText('Verification Status: Rejected')).toBeInTheDocument();
    expect(screen.getByText('Reason: Documents unclear')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });
});
