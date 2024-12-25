import React from 'react';
import { format } from 'date-fns';
import { Calendar, DollarSign } from 'lucide-react';
import type { Booking } from '../../types';

interface BookingListProps {
  bookings: Booking[];
}

export function BookingList({ bookings }: BookingListProps) {
  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{booking.car.name}</h3>
              <div className="flex items-center text-gray-600 mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  {format(new Date(booking.start_date), 'MMM d, yyyy')} -{' '}
                  {format(new Date(booking.end_date), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center text-gray-600 mt-1">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>${booking.total_price}</span>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-sm font-medium ${
                booking.status === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : booking.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : booking.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}