import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Users, Car, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalCars: number;
  activeCars: number;
  currentBookings: number;
  totalBookings: number;
  currentRevenue: number;
  lastMonthRevenue: number;
}

interface RecentActivity {
  verifications: Array<{
    id: string;
    user_id: string;
    full_name: string;
    created_at: string;
    status: string;
  }>;
  carListings: Array<{
    id: string;
    name: string;
    make: string;
    model: string;
    created_at: string;
    status: string;
  }>;
}

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity>({
    verifications: [],
    carListings: [],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get current date and last month date
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Fetch users data
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Fetch cars data
      const { count: totalCars } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true });

      const { count: activeCars } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Fetch bookings data
      const { count: currentBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'confirmed')
        .gte('start_date', startOfMonth.toISOString());

      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Fetch revenue data
      const { data: currentRevenue } = await supabase
        .from('bookings')
        .select('total_price')
        .gte('created_at', startOfMonth.toISOString())
        .eq('status', 'confirmed');

      const { data: lastMonthRevenue } = await supabase
        .from('bookings')
        .select('total_price')
        .gte('created_at', lastMonth.toISOString())
        .lt('created_at', startOfMonth.toISOString())
        .eq('status', 'confirmed');

      // Calculate total revenue
      const currentMonthTotal = currentRevenue?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0;
      const lastMonthTotal = lastMonthRevenue?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0;

      // Fetch recent verifications
      const { data: verifications } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, created_at, status')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent car listings
      const { data: carListings } = await supabase
        .from('cars')
        .select('id, name, make, model, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalCars: totalCars || 0,
        activeCars: activeCars || 0,
        currentBookings: currentBookings || 0,
        totalBookings: totalBookings || 0,
        currentRevenue: currentMonthTotal,
        lastMonthRevenue: lastMonthTotal,
      });

      setRecentActivity({
        verifications: verifications || [],
        carListings: carListings || [],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return { value: '+100%', type: 'increase' };
    const change = ((current - previous) / previous) * 100;
    return {
      value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
      type: change >= 0 ? 'increase' : 'decrease',
    };
  };

  const statsData = stats
    ? [
        {
          name: 'Total Users',
          value: stats.totalUsers.toLocaleString(),
          icon: Users,
          change: calculateChange(stats.activeUsers, stats.totalUsers - stats.activeUsers),
        },
        {
          name: 'Active Cars',
          value: stats.activeCars.toLocaleString(),
          icon: Car,
          change: calculateChange(stats.activeCars, stats.totalCars - stats.activeCars),
        },
        {
          name: 'Current Bookings',
          value: stats.currentBookings.toLocaleString(),
          icon: Calendar,
          change: calculateChange(stats.currentBookings, stats.totalBookings - stats.currentBookings),
        },
        {
          name: 'Revenue',
          value: `$${stats.currentRevenue.toLocaleString()}`,
          icon: DollarSign,
          change: calculateChange(stats.currentRevenue, stats.lastMonthRevenue),
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="px-4 py-5">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((item) => (
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
                  item.change.type === 'increase'
                    ? 'text-green-500 dark:text-green-400'
                    : 'text-red-500 dark:text-red-400'
                )}
              >
                {item.change.type === 'increase' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{item.change.value}</span>
              </span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">from last month</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Verifications</h3>
          <div className="mt-4 space-y-4">
            {recentActivity.verifications.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">No pending verifications</div>
            ) : (
              recentActivity.verifications.map((verification) => (
                <div
                  key={verification.id}
                  className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {verification.full_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(verification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-1 text-xs rounded-full',
                      verification.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    )}
                  >
                    {verification.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Car Listings</h3>
          <div className="mt-4 space-y-4">
            {recentActivity.carListings.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">No recent car listings</div>
            ) : (
              recentActivity.carListings.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {car.make} {car.model}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(car.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-1 text-xs rounded-full',
                      car.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : car.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    )}
                  >
                    {car.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
