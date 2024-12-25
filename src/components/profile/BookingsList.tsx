import { Button } from '../ui/Button';
import type { Booking } from '../../types/supabase';
import { Link } from 'react-router-dom';

interface BookingsListProps {
  bookings: Booking[];
}

export default function BookingsList({ bookings }: BookingsListProps) {
  const activeBookings = bookings.filter(b => b.status !== 'completed');
  const pastBookings = bookings.filter(b => b.status === 'completed');

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You have no bookings yet</p>
        <Link to="/browse">
          <Button className="mt-4">Browse Cars</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeBookings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Active Bookings</h3>
          <div className="space-y-4">
            {activeBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{booking.car?.name}</h4>
                    <p className="text-gray-600">
                      {new Date(booking.start_date).toLocaleDateString()} -{' '}
                      {new Date(booking.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${booking.total_price}</p>
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pastBookings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Past Bookings</h3>
          <div className="space-y-4">
            {pastBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{booking.car?.name}</h4>
                    <p className="text-gray-600">
                      {new Date(booking.start_date).toLocaleDateString()} -{' '}
                      {new Date(booking.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${booking.total_price}</p>
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
