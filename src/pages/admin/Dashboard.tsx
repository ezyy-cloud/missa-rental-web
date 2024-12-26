import React from 'react';
import { Card } from '@/components/ui/Card';
import { Users, Car, Calendar, DollarSign } from 'lucide-react';

const stats = [
  { name: 'Total Users', value: '2,100', icon: Users, change: '+10%', changeType: 'increase' },
  { name: 'Active Cars', value: '450', icon: Car, change: '+5.4%', changeType: 'increase' },
  { name: 'Current Bookings', value: '89', icon: Calendar, change: '+2.5%', changeType: 'increase' },
  { name: 'Revenue', value: '$45,200', icon: DollarSign, change: '+8.1%', changeType: 'increase' },
];

export function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.name} className="px-4 py-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{item.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <span
                className={
                  'inline-flex text-sm ' +
                  (item.changeType === 'increase' ? 'text-green-500' : 'text-red-500')
                }
              >
                {item.change}
              </span>
              <span className="text-sm text-gray-500"> from last month</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Verifications</h3>
          <div className="mt-4 space-y-4">
            {/* Add verification requests list */}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Car Listings</h3>
          <div className="mt-4 space-y-4">
            {/* Add car listings list */}
          </div>
        </Card>
      </div>
    </div>
  );
}
