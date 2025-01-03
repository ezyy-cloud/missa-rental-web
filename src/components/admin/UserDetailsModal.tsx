import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Profile } from '@/types';

interface UserDetailsModalProps {
  user: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (userId: string) => void;
  onReject: (userId: string) => void;
  onSuspend: (userId: string) => void;
}

export function UserDetailsModal({ user, isOpen, onClose, onVerify, onReject, onSuspend }: UserDetailsModalProps) {
  if (!user) return null;

  const handleVerify = () => {
    onVerify(user.id);
  };

  const handleReject = () => {
    if (confirm('Are you sure you want to reject this user\'s KYC?')) {
      onReject(user.id);
    }
  };

  const handleSuspend = () => {
    if (confirm('Are you sure you want to suspend this user?')) {
      onSuspend(user.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* User Profile Section */}
            <div className="flex items-start space-x-4">
              {user.avatar_url && (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || ''}
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.full_name || 'No name provided'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* KYC Status */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                Account Status
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">KYC Status</p>
                  <p className="text-sm text-gray-900 dark:text-white capitalize">{user.kyc_status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">KYC Verified At</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {user.kyc_verified_at ? new Date(user.kyc_verified_at).toLocaleString() : 'Not verified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {user.is_suspended ? (
                      <span className="text-red-600">Suspended</span>
                    ) : (
                      <span className="text-green-600">Active</span>
                    )}
                  </p>
                </div>
                {user.is_suspended && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Suspended At</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {user.suspended_at ? new Date(user.suspended_at).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Suspension Reason</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {user.suspension_reason || 'No reason provided'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                Contact Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm text-gray-900 dark:text-white">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-sm text-gray-900 dark:text-white">{user.phone || 'Not provided'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                  <div className="text-sm text-gray-900 dark:text-white space-y-1">
                    {user.address_line1 ? (
                      <>
                        <p>{user.address_line1}</p>
                        {user.address_line2 && <p>{user.address_line2}</p>}
                        <p>
                          {[
                            user.city,
                            user.state,
                            user.postal_code
                          ].filter(Boolean).join(', ')}
                        </p>
                        {user.country && <p>{user.country}</p>}
                      </>
                    ) : (
                      'Not provided'
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Documents */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                Verification Documents
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ID Front</p>
                  {user.id_front_url ? (
                    <a
                      href={user.id_front_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View Document
                    </a>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ID Back</p>
                  {user.id_back_url ? (
                    <a
                      href={user.id_back_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View Document
                    </a>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Driver's License Front</p>
                  {user.drivers_license_front_url ? (
                    <a
                      href={user.drivers_license_front_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View Document
                    </a>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Driver's License Back</p>
                  {user.drivers_license_back_url ? (
                    <a
                      href={user.drivers_license_back_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View Document
                    </a>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Selfie</p>
                  {user.selfie_url ? (
                    <a
                      href={user.selfie_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View Document
                    </a>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white">Not provided</p>
                  )}
                </div>
              </div>
            </div>

            {/* Verification Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-end space-x-4">
              <Button
                onClick={handleSuspend}
                className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                disabled={user.is_suspended}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Suspend User</span>
              </Button>
              <Button
                onClick={handleReject}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white"
                disabled={user.kyc_status === 'rejected'}
              >
                <XCircle className="w-4 h-4" />
                <span>Reject KYC</span>
              </Button>
              <Button
                onClick={handleVerify}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white"
                disabled={user.kyc_status === 'verified'}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Verify KYC</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Dialog>
  );
}
