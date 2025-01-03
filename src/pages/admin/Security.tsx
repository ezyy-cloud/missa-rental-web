import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Filter, Shield, AlertTriangle, Clock, UserX } from 'lucide-react';
import type { AdminAction } from '@/types';
import { cn } from '@/lib/utils';

const mockActions: AdminAction[] = [
  {
    id: '1',
    admin_id: '1',
    action_type: 'verify_user',
    target_id: 'user123',
    reason: 'Valid ID provided',
    created_at: '2023-12-25',
    admin: {
      id: '1',
      full_name: 'Admin User',
      email: 'admin@example.com',
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
      avatar_url: null,
      phone: null,
      bio: null,
      address: null,
      preferred_contact: null,
      verification_status: 'verified',
      id_type: null,
      id_number: null,
      id_expiry_date: null,
      id_country: null,
      drivers_license_number: null,
      drivers_license_expiry: null,
      drivers_license_country: null,
      emergency_contact_name: null,
      emergency_contact_phone: null,
      emergency_contact_relationship: null,
      is_owner: false,
      stripe_customer_id: null,
      stripe_account_id: null,
      role: 'admin',
      last_login: null,
      is_suspended: false,
    },
  },
  // Add more mock actions as needed
];

const securityStats = [
  { name: 'Pending Verifications', value: '24', icon: Clock, change: '+12%', changeType: 'increase' },
  { name: 'Flagged Users', value: '8', icon: AlertTriangle, change: '-25%', changeType: 'decrease' },
  { name: 'Suspended Accounts', value: '3', icon: UserX, change: '0%', changeType: 'neutral' },
  { name: 'Security Alerts', value: '15', icon: Shield, change: '+5%', changeType: 'increase' },
];

export function AdminSecurity() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const getActionColor = (actionType: AdminAction['action_type']) => {
    switch (actionType) {
      case 'verify_user':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'suspend_user':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'approve_car':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'reject_car':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'flag_car':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Security Management</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {securityStats.map((item) => (
          <Card key={item.name} className="px-4 py-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className="h-6 w-6 text-gray-400 dark:text-gray-300" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {item.name}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {item.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span
                className={cn(
                  'inline-flex items-center text-sm space-x-1',
                  item.changeType === 'increase'
                    ? 'text-green-500 dark:text-green-400'
                    : item.changeType === 'decrease'
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400'
                )}
              >
                <span>{item.change}</span>
              </span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                from last month
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Target ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {mockActions.map((action) => (
                <tr key={action.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {action.admin?.full_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {action.admin?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        getActionColor(action.action_type)
                      )}
                    >
                      {action.action_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {action.target_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {action.reason || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(action.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
