import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, XCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Profile } from '@/types';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/stores/admin';
import { supabase } from '@/lib/supabase';
import { UserDetailsModal } from '@/components/admin/UserDetailsModal';

export function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected' | 'suspended'>('all');
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const { verifyUser } = useAdminStore();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let query = supabase.from('profiles').select('*');

      // Apply filter
      switch (filter) {
        case 'pending':
          query = query.eq('kyc_status', 'pending');
          break;
        case 'verified':
          query = query.eq('kyc_status', 'verified');
          break;
        case 'rejected':
          query = query.eq('kyc_status', 'rejected');
          break;
        case 'suspended':
          query = query.eq('is_suspended', true);
          break;
        default:
          // For 'all', don't apply any filter
          break;
      }

      // Apply search if provided
      if (searchTerm) {
        const searchFilter = `or(full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%)`;
        query = query.or(searchFilter);
      }

      // Order by most recent first
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize admin store
  useEffect(() => {
    useAdminStore.getState().initializeAdmin();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [filter, searchTerm]);

  const getStatusColor = (user: Profile) => {
    if (user.is_suspended) {
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    }
    switch (user.kyc_status) {
      case 'verified':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const getUserStatus = (user: Profile) => {
    if (user.is_suspended) return 'Suspended';
    if (user.kyc_status === 'rejected') return 'KYC Rejected';
    if (user.kyc_status === 'verified') return 'KYC Verified';
    return 'KYC Pending';
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      await verifyUser(userId);
      fetchUsers(); // Refresh the list after verification
      setSelectedUser(null);
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      await supabase
        .from('profiles')
        .update({
          kyc_status: 'rejected'
        })
        .eq('id', userId);
      fetchUsers(); // Refresh the list after rejection
      setSelectedUser(null);
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      const reason = prompt('Please enter a reason for suspension:');
      if (!reason) return;

      await supabase
        .from('profiles')
        .update({
          is_suspended: true,
          suspended_at: new Date().toISOString(),
          suspension_reason: reason
        })
        .eq('id', userId);
      fetchUsers(); // Refresh the list after suspension
      setSelectedUser(null);
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Users Management</h1>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Users</option>
              <option value="pending">Pending KYC</option>
              <option value="verified">Verified KYC</option>
              <option value="rejected">Rejected KYC</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  KYC Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Verified At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar_url ? (
                            <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.full_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                          getStatusColor(user)
                        )}
                      >
                        {getUserStatus(user)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.kyc_verified_at ? new Date(user.kyc_verified_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.role || 'user'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <UserDetailsModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onVerify={handleVerifyUser}
        onReject={handleRejectUser}
        onSuspend={handleSuspendUser}
      />
    </div>
  );
}
